import { SimpleLoading } from '@components/SimpleLoading';
import {
  ICollectedUTXOResp,
  IFeeRate,
  ITxHistory,
  ITxHistoryBuyInsETH,
  ITxHistoryPurchase,
} from '@interfaces/api/bitcoin';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import {
  getCollectedUTXO,
  getFeeRate,
  getHistory,
  getPendingUTXOs,
  getTokenRate,
} from '@services/bitcoin';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { getError } from '@utils/text';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useRouter } from 'next/router';
import { validateEVMAddress } from '@utils/validate';
import { currentAssetsBuilder, comingAmountBuilder } from '@utils/utxo';

const LOG_PREFIX = 'ASSETS_CONTEXT';

export interface IAssetsContext {
  currentAssets: ICollectedUTXOResp | undefined;
  assets: ICollectedUTXOResp | undefined;
  isLoadingAssets: boolean;
  isLoadedAssets: boolean;

  isOwner: boolean;

  history: ITxHistory[];
  txsETH: ITxHistoryBuyInsETH[];
  txsPurchase: ITxHistoryPurchase[];
  isLoadingHistory: boolean;
  isLoadedHistory: boolean;

  feeRate: IFeeRate | undefined;

  comingAmount: number;

  fetchAssets: () => void;
  fetchHistory: () => void;
  debounceFetchData: () => void;
  fetchFeeRate: () => Promise<IFeeRate | undefined>;

  eth2btcRate: number;

  getAvailableAssetsCreateTx: () => Promise<ICollectedUTXOResp | undefined>;
}

const initialValue: IAssetsContext = {
  currentAssets: undefined,
  assets: undefined,
  isLoadingAssets: false,
  isLoadedAssets: false,

  history: [],
  txsETH: [],
  txsPurchase: [],
  isLoadingHistory: false,
  isLoadedHistory: false,

  feeRate: undefined,
  isOwner: false,

  comingAmount: 0,

  eth2btcRate: 0,

  fetchAssets: () => new Promise<void>(r => r()),
  fetchHistory: () => new Promise<void>(r => r()),
  debounceFetchData: () => new Promise<void>(r => r()),
  fetchFeeRate: () => new Promise<IFeeRate | undefined>(() => null),
  getAvailableAssetsCreateTx: () =>
    new Promise<ICollectedUTXOResp | undefined>(() => null),
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { walletAddress } = router.query as { walletAddress: string };
  const currentAddress = React.useMemo(() => {
    // if (
    //   !!walletAddress &&
    //   validateBTCAddress(walletAddress) &&
    //   router.asPath.includes(ROUTE_PATH.PROFILE)
    // ) {
    //   return walletAddress;
    // }
    return user?.walletAddressBtcTaproot || '';
  }, [user?.walletAddressBtcTaproot]);

  // UTXOs
  const [assets, setAssets] = useState<ICollectedUTXOResp | undefined>();
  const [currentAssets, setCurrentAssets] = useState<
    ICollectedUTXOResp | undefined
  >();
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(false);
  const [isLoadedAssets, setIsLoadedAssets] = useState<boolean>(false);

  // History
  const [history, setHistory] = useState<ITxHistory[]>([]);
  const [txsETH, setTxsETH] = useState<ITxHistoryBuyInsETH[]>([]);
  const [txsPurchase, setTxsPurchase] = useState<ITxHistoryPurchase[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadedHistory, setIsLoadedHistory] = useState<boolean>(false);

  // Fee rate
  const [feeRate, setFeeRate] = useState<IFeeRate | undefined>();

  const [comingAmount, setcomingAmount] = useState<number>(0);
  const [eth2btcRate, setEth2BtcRate] = useState<number>(0);

  const isOwner = React.useMemo(() => {
    if (!walletAddress || validateEVMAddress(walletAddress)) return true;
    return !!user && user?.walletAddressBtcTaproot === walletAddress;
  }, [walletAddress, user]);

  const fetchAssets = async (): Promise<ICollectedUTXOResp | undefined> => {
    if (!currentAddress) return undefined;
    let _assets = undefined;
    try {
      setIsLoadingAssets(true);
      _assets = await getCollectedUTXO(currentAddress);
      setAssets(_assets);
    } catch (err) {
      const error = getError(err);
      log(error.message, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsLoadingAssets(false);
      setIsLoadedAssets(true);
    }
    return _assets;
  };

  const fetchHistory = async (): Promise<ITxHistory[]> => {
    if (!currentAddress) {
      setHistory([]);
      setTxsETH([]);
      setTxsPurchase([]);
      return [];
    }
    let _history: ITxHistory[] = [];
    try {
      setIsLoadingHistory(true);
      const { txs, txsETH, txsPurchase } = await getHistory(currentAddress);
      _history = txs;
      setHistory(_history);
      setTxsETH(txsETH);
      setTxsPurchase(txsPurchase);
    } catch (err) {
      const error = getError(err);
      log(error.message, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsLoadingHistory(false);
      setIsLoadedHistory(true);
    }
    return _history;
  };

  const fetchData = async () => {
    const [assets, pendingUTXOs, _] = await Promise.all([
      await fetchAssets(),
      await getPendingUTXOs(currentAddress),
      await fetchHistory(),
    ]);

    // Current assets
    let _currentAssets = undefined;
    if (assets) {
      _currentAssets = currentAssetsBuilder({
        current: assets,
        pending: pendingUTXOs,
      });
    }
    setCurrentAssets(_currentAssets);

    // Coming amount...
    const _comingAmount = comingAmountBuilder(currentAddress, pendingUTXOs);
    setcomingAmount(_comingAmount);
  };

  const debounceFetchData = React.useCallback(debounce(fetchData, 300), [
    currentAddress,
  ]);

  const fetchFeeRate = async () => {
    let _feeRate = {
      fastestFee: 15,
      halfHourFee: 10,
      hourFee: 5,
    };
    try {
      _feeRate = await getFeeRate();
      setFeeRate(_feeRate);
    } catch (error) {
      setFeeRate(_feeRate);
    }
    return _feeRate;
  };

  const getAvailableAssetsCreateTx = async () => {
    const [assets, pendingUTXOs] = await Promise.all([
      await fetchAssets(),
      await getPendingUTXOs(currentAddress),
    ]);

    // Current assets
    let _currentAssets = undefined;
    if (assets) {
      _currentAssets = currentAssetsBuilder({
        current: assets,
        pending: pendingUTXOs,
      });
    }
    setCurrentAssets(_currentAssets);

    return _currentAssets;
  };

  const getETH2BTCRate = async () => {
    try {
      const rate = await getTokenRate();
      setEth2BtcRate(rate);
    } catch (error) {
      const _err = getError(error);
      log(_err.message, LogLevel.ERROR, LOG_PREFIX + 'getETH2BTCRate');
    }
  };

  useEffect(() => {
    if (currentAddress) {
      debounceFetchData();
    } else {
      setHistory([]);
    }
  }, [currentAddress]);

  useEffect(() => {
    fetchFeeRate().then().catch();
    getETH2BTCRate().then().catch();
    const intervalID = setInterval(() => {
      fetchFeeRate().then().catch();
      getETH2BTCRate().then().catch();
    }, 60 * 2 * 1000); // 2 mins
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      currentAssets,
      assets,
      isLoadingAssets,
      isLoadedAssets,

      history,
      txsETH,
      txsPurchase,
      isLoadingHistory,
      isLoadedHistory,

      feeRate,

      isOwner,

      comingAmount,

      fetchAssets,
      fetchHistory,
      fetchFeeRate,
      getAvailableAssetsCreateTx,

      debounceFetchData,

      eth2btcRate,
    };
  }, [
    currentAssets,
    assets,
    isLoadingAssets,
    isLoadedAssets,

    history,
    txsETH,
    txsPurchase,
    isLoadingHistory,
    isLoadedHistory,

    isOwner,

    feeRate,

    comingAmount,

    currentAddress,

    eth2btcRate,
  ]);

  return (
    <AssetsContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </AssetsContext.Provider>
  );
};
