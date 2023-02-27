import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WalletManager } from '@services/wallet';
import { generateNonceMessage, verifyNonceMessage } from '@services/auth';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { resetUser, setUser } from '@redux/user/action';
import { WalletError } from '@enums/wallet-error';
import { clearAuthStorage, setAccessToken } from '@utils/auth';
import { getProfile } from '@services/profile';
import { NETWORK_CHAIN_ID } from '@constants/config';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { METAMASK_DOWNLOAD_PAGE } from '@constants/common';
import { isMobile } from '@utils/animation';
import { openMetamaskDeeplink } from '@utils/metamask';
import { generateBitcoinKey } from '@hooks/useBTCSignOrd/connect.methods';
import { getReferral } from '@utils/referral';
import { postReferralCode } from '@services/referrals';

const LOG_PREFIX = 'WalletContext';

interface IWalletState {
  chainID: number;
}

export interface IWalletContext {
  connectedAddress: () => Promise<string | null>;
  walletManager: WalletManager | null;
  checkAndSwitchChain: (params: IWalletState) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  transfer: (addr: string, val: string) => Promise<string | null>;
  walletBalance: number;
  getWalletBalance: () => Promise<number>;
}

const initialValue: IWalletContext = {
  connectedAddress: () => new Promise(r => r(null)),
  walletManager: null,
  checkAndSwitchChain: async (_: IWalletState): Promise<void> =>
    new Promise(r => r()),
  connect: () => new Promise<void>(r => r()),
  disconnect: () => new Promise<void>(r => r()),
  transfer: (_address: string, _val: string) =>
    new Promise<string | null>(r => r(null)),
  walletBalance: 0,
  getWalletBalance: () => new Promise<number>(r => r(0)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [walletManager, setWalletManager] = useState<WalletManager | null>(
    null
  );
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const walletManagerRef = useRef<WalletManager | null>(walletManager);
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);

  const isDeepLinkRequired = (): boolean => {
    const wallet = walletManagerRef.current;

    return isMobile() && !wallet?.isInstalled();
  };

  const connectedAddress = useCallback(async (): Promise<string | null> => {
    if (isDeepLinkRequired()) {
      openMetamaskDeeplink();
      return null;
    }

    const wallet = walletManagerRef.current;

    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    if (!wallet.isInstalled()) {
      window.open(METAMASK_DOWNLOAD_PAGE);
      throw Error(WalletError.NO_METAMASK);
    }

    const walletAddress = await wallet.connectedAddress();
    return walletAddress;
  }, []);

  const checkAndSwitchChain = useCallback(
    async ({ chainID }: IWalletState): Promise<void> => {
      const wallet = walletManagerRef.current;

      if (!wallet) {
        throw Error(WalletError.NO_INSTANCE);
      }

      const isChainSupported = await wallet.isChainSupported(chainID);
      if (!isChainSupported) {
        const walletRes = await wallet.requestSwitchChain(chainID);
        if (walletRes.isError) {
          throw Error(walletRes.message);
        }
      }
    },
    []
  );

  const postRefCode = async () => {
    const refCode = getReferral();

    if (refCode && user && refCode !== user.id) {
      await postReferralCode(refCode);
    }
  };

  const connect = useCallback(async (): Promise<void> => {
    if (isDeepLinkRequired()) {
      openMetamaskDeeplink();
      return;
    }

    const wallet = walletManagerRef.current;

    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    if (!wallet.isInstalled()) {
      window.open(METAMASK_DOWNLOAD_PAGE);
      throw Error(WalletError.NO_METAMASK);
    }

    const walletRes = await wallet.connect();
    if (!walletRes.isSuccess || !walletRes.data) {
      throw Error(walletRes.message);
    }

    await checkAndSwitchChain({ chainID: NETWORK_CHAIN_ID });

    const walletAddress = walletRes.data;
    try {
      const { message: nonceMessage } = await generateNonceMessage({
        address: walletAddress,
      });

      const { segwit, taproot } = await generateBitcoinKey({
        address: walletAddress,
        message: nonceMessage,
      });

      if (
        !taproot.sendAddress ||
        !segwit.sendAddress ||
        !segwit.signature ||
        !segwit.messagePrefix
      ) {
        throw Error(WalletError.FAILED_LINK_WALLET);
      }

      const { accessToken, refreshToken } = await verifyNonceMessage({
        signature: segwit.signature.toString('base64'),
        address: walletAddress,

        messagePrefix: segwit.messagePrefix,
        addressBtcSegwit: segwit.sendAddress,

        addressBtc: taproot.sendAddress,
      });

      setAccessToken(accessToken, refreshToken);
      const userRes = await getProfile();
      dispatch(setUser(userRes));
    } catch (err: unknown) {
      log('failed to connect wallet', LogLevel.ERROR, LOG_PREFIX);
      throw Error(WalletError.FAILED_LINK_WALLET);
    }
  }, [dispatch]);

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      clearAuthStorage();
      dispatch(resetUser());
    } catch (err: unknown) {
      log('failed to disconnect wallet', LogLevel.ERROR, LOG_PREFIX);
      throw Error(WalletError.FAILED_UNLINK_WALLET);
    }
  }, [dispatch]);

  const transfer = useCallback(
    async (toAddress: string, value: string): Promise<string | null> => {
      if (isDeepLinkRequired()) {
        openMetamaskDeeplink();
        return '';
      }

      const wallet = walletManagerRef.current;

      if (!wallet) {
        throw Error(WalletError.NO_INSTANCE);
      }

      if (!wallet.isInstalled()) {
        window.open(METAMASK_DOWNLOAD_PAGE);
        throw Error(WalletError.NO_METAMASK);
      }

      const walletRes = await wallet.connect();
      if (!walletRes.isSuccess || !walletRes.data) {
        throw Error(walletRes.message);
      }

      try {
        await checkAndSwitchChain({
          chainID: NETWORK_CHAIN_ID,
        });
      } catch (err: unknown) {
        log('failed to switch chain', LogLevel.ERROR, LOG_PREFIX);
        throw Error(WalletError.FAILED_SWITCH_CHAIN);
      }

      const walletAddress = walletRes.data;
      try {
        const transferRes = await wallet.transfer({
          fromAddress: walletAddress,
          toAddress,
          value,
        });
        if (!transferRes.data || !transferRes.isSuccess) {
          throw Error(transferRes.message);
        }
        return transferRes.data;
      } catch (err: unknown) {
        log('failed to transfer', LogLevel.ERROR, LOG_PREFIX);
        throw Error(WalletError.FAILED_TRANSFER);
      }
    },
    []
  );

  const getWalletBalance = async (): Promise<number> => {
    if (isDeepLinkRequired()) {
      openMetamaskDeeplink();
      return 0;
    }

    const wallet = walletManagerRef.current;

    if (!wallet) {
      throw Error(WalletError.NO_INSTANCE);
    }

    if (!wallet.isInstalled()) {
      window.open(METAMASK_DOWNLOAD_PAGE);
      throw Error(WalletError.NO_METAMASK);
    }

    const walletAddress = await connectedAddress();

    if (walletAddress) {
      const balanceRes = await wallet.getBalance(walletAddress);
      if (balanceRes.data) {
        const balanceStr = Web3.utils.fromWei(
          balanceRes.data.toString(),
          'ether'
        );
        setWalletBalance(parseFloat(balanceStr));
        return parseFloat(balanceStr);
      }
    }
    return 0;
  };

  useEffect(() => {
    const walletManagerInstance = new WalletManager();
    walletManagerRef.current = walletManagerInstance;
    setWalletManager(walletManagerInstance);
  }, []);

  useEffect(() => {
    if (
      walletManager &&
      walletManager.isConnected() &&
      user &&
      user.walletAddress
    ) {
      getWalletBalance();
    }
  }, [walletManager, user]);

  useEffect(() => {
    if (user && user.walletAddress) {
      postRefCode();
    }
  }, [user]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      checkAndSwitchChain,
      connect,
      disconnect,
      walletManager,
      connectedAddress,
      transfer,
      walletBalance,
      getWalletBalance,
    };
  }, [
    connect,
    disconnect,
    checkAndSwitchChain,
    walletManager,
    connectedAddress,
    transfer,
    walletBalance,
    getWalletBalance,
  ]);

  return (
    <WalletContext.Provider value={contextValues}>
      {children}
    </WalletContext.Provider>
  );
};
