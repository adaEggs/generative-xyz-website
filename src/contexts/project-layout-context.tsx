import { SimpleLoading } from '@components/SimpleLoading';
import { NETWORK_CHAIN_ID, REPORT_COUNT_THRESHOLD } from '@constants/config';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import useContractOperation from '@hooks/useContractOperation';
import { Token } from '@interfaces/token';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { getMarketplaceStats } from '@services/marketplace';

import log from '@utils/logger';

import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { WalletContext } from '@contexts/wallet-context';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import { MarketplaceStats } from '@interfaces/marketplace';
import dayjs from 'dayjs';
import { IMintGenerativeNFTParams } from '@interfaces/contract-operations/mint-generative-nft';
import { TransactionReceipt } from 'web3-eth';
import MintGenerativeNFTOperation from '@services/contract-operations/generative-nft/mint-generative-nft';
import { checkIsBitcoinProject } from '@utils/generative';
import Web3 from 'web3';
import { isTestnet } from '@utils/chain';
import _get from 'lodash/get';
import {
  base64ToUtf8,
  escapeSpecialChars,
  formatBTCPrice,
  formatEthPrice,
} from '@utils/format';
import { PaymentMethod } from '@enums/mint-generative';
import { isWalletWhiteList, wordCase } from '@utils/common';
import { Project } from '@interfaces/project';
import { useRouter } from 'next/router';
import { getCategoryList } from '@services/category';
import { LocalStorageKey } from '@enums/local-storage';
import { Category } from '@interfaces/category';
import useAsyncEffect from 'use-async-effect';

const LOG_PREFIX = 'ProjectLayoutContext';

export interface IProjectLayoutContext {
  project?: Project | null;
  isHasBtcWallet: boolean;
  creatorAddress: string;
  isTwVerified: boolean;
  isCreated: boolean;
  projectName: string;
  isEdit: boolean;
  minted: string;
  isRoyalty: boolean;
  mintedDate: string;
  isFullonChain: boolean;
  hasProjectInteraction: boolean;
  showReportModal: boolean;
  setShowReportModal: (b: boolean) => void;
  showReportMsg: boolean;
  isMinting: boolean;
  isAvailable: boolean;
  hasReported: boolean;
  isLimitMinted: boolean;
  priceMemo: string;
  priceEthMemo: string;
  textMint: string;
  handleMintToken: () => void;
  onHandlePaymentWithWallet: () => void;
  marketplaceStats: MarketplaceStats | null;
  isBitcoinProject: boolean;
  projectDetail: Omit<Token, 'owner'> | null;
  openMintBTCModal: (s: PaymentMethod) => void;
  isWhitelist?: boolean;
  hasMint?: boolean;
  origin?: string;
  categoryName: string | null;
}

const initialValue: IProjectLayoutContext = {
  project: null,
  isHasBtcWallet: false,
  creatorAddress: '',
  isTwVerified: false,
  isCreated: false,
  projectName: '',
  isEdit: false,
  minted: '',
  isRoyalty: false,
  mintedDate: '',
  isFullonChain: false,
  hasProjectInteraction: false,
  showReportModal: false,
  setShowReportModal: _b => {
    return;
  },
  openMintBTCModal: _b => {
    return;
  },
  marketplaceStats: null,
  showReportMsg: false,
  isMinting: false,
  isAvailable: false,
  isLimitMinted: false,
  hasReported: false,
  priceMemo: '',
  priceEthMemo: '',
  textMint: '',
  handleMintToken: () => {
    return;
  },
  onHandlePaymentWithWallet: () => {
    return;
  },
  isBitcoinProject: true,
  projectDetail: null,
  isWhitelist: undefined,
  origin: '',
  hasMint: false,
  categoryName: '',
};

export const ProjectLayoutContext =
  React.createContext<IProjectLayoutContext>(initialValue);

type Props = {
  project?: Project | null;
  openMintBTCModal: (s: PaymentMethod) => void;
  isWhitelist?: boolean;
  children: ReactNode;
};

export const ProjectLayoutProvider = ({
  children,
  project,
  isWhitelist,
  openMintBTCModal,
}: Props): React.ReactElement => {
  const router = useRouter();
  const user = useAppSelector(getUserSelector);
  const { getWalletBalance, connect } = useContext(WalletContext);
  const { setPaymentMethod, setIsPopupPayment, setPaymentStep } = useContext(
    BitcoinProjectContext
  );
  const [projectDetail, setProjectDetail] = useState<Omit<
    Token,
    'owner'
  > | null>(null);
  const [isAvailable, _setIsAvailable] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasProjectInteraction, setHasProjectInteraction] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  useEffect(() => {
    const exists = project?.desc.includes('Interaction');
    if (exists) {
      setHasProjectInteraction(true);
    } else {
      setHasProjectInteraction(false);
    }
  }, [project?.desc]);

  const [marketplaceStats, setMarketplaceStats] =
    useState<MarketplaceStats | null>(null);

  const mintedTime = project?.mintedTime;
  let mintDate = dayjs();
  if (mintedTime) {
    mintDate = dayjs(mintedTime);
  }
  const mintedDate = mintDate.format('MMM DD, YYYY');
  const {
    call: mintToken,
    reset: resetMintToken,
    errorMessage,
  } = useContractOperation<IMintGenerativeNFTParams, TransactionReceipt>(
    MintGenerativeNFTOperation,
    true
  );
  const [isMinting, setIsMinting] = useState(false);

  const isBitcoinProject = useMemo((): boolean => {
    if (!project) return false;
    return checkIsBitcoinProject(project.tokenID);
  }, [project]);

  const isLimitMinted = useMemo((): boolean => {
    if (!project) return false;
    return project?.mintingInfo?.index < project?.maxSupply;
  }, [project]);

  const hasMint = useMemo((): boolean => {
    if (!project) return false;
    return project?.mintingInfo?.index > 0;
  }, [project]);

  const textMint = useMemo((): string => {
    return Number(project?.mintPrice) ? 'Mint' : 'Free mint';
  }, [project]);

  const handleFetchMarketplaceStats = async () => {
    try {
      if (projectDetail && project?.genNFTAddr) {
        const res = await getMarketplaceStats({
          collectionAddr: project?.genNFTAddr,
        });
        if (res) setMarketplaceStats(res?.stats);
      }
    } catch (e) {
      log('can not fetch price', LogLevel.ERROR, '');
    }
  };

  const handleMintToken = async () => {
    try {
      setIsMinting(true);

      if (!project) {
        return;
      }

      const walletBalance = await getWalletBalance();

      if (
        walletBalance <
        parseFloat(Web3.utils.fromWei(project.mintPriceEth.toString()))
      ) {
        if (isTestnet()) {
          toast.error(
            'Insufficient funds testnet. Go to profile and get testnet faucet'
          );
        } else {
          toast.error('Insufficient funds.');
        }
        return;
      }

      const mintTx = await mintToken({
        projectAddress: project.genNFTAddr,
        mintFee: project.mintPriceEth.toString(),
        chainID: NETWORK_CHAIN_ID,
      });

      if (!mintTx) {
        toast.error(ErrorMessage.DEFAULT);
        return;
      }

      const tokenID: string | null = _get(
        mintTx,
        'events.Transfer.returnValues.tokenId',
        null
      );
      setTimeout(() => {
        router.push(`/generative/${project.tokenID}/${tokenID}`);
      }, 1000);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsMinting(false);
    }
  };

  const priceMemo = useMemo(
    () => formatBTCPrice(Number(project?.mintPrice)),
    [project?.mintPrice]
  );

  const priceEthMemo = useMemo(
    () => formatEthPrice(project?.mintPriceEth || null),
    [project?.mintPriceEth]
  );

  const isFullonChain = useMemo(() => {
    return project?.isFullChain || false;
  }, [project?.isFullChain]);

  // pay with wallet project btc

  const payWithWallet = () => {
    setPaymentMethod(PaymentMethod.WALLET);
    setIsPopupPayment(true);
    setPaymentStep('mint');
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
      payWithWallet();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const onHandlePaymentWithWallet = useCallback(() => {
    if (isConnecting) return;
    if (!user) {
      handleConnectWallet();
    } else {
      payWithWallet();
    }
  }, [user, isConnecting]);

  const isRoyalty = useMemo((): boolean => {
    if (!project?.royalty) return false;
    return project?.royalty > 0;
  }, [project]);

  const isCreated = useMemo((): boolean => {
    return project?.creatorAddr === user?.walletAddress;
  }, [user, project]);

  const isEdit = useMemo((): boolean => {
    return isCreated || isWalletWhiteList(user?.walletAddress || '');
  }, [isCreated, user]);

  const isTwVerified = useMemo(() => {
    return project?.creatorProfile?.profileSocial?.twitterVerified || false;
  }, [project?.creatorProfile?.profileSocial]);

  const minted = useMemo((): string => {
    return `${
      (project?.mintingInfo?.index || 0) +
      (Number(project?.mintingInfo.indexReserve) || 0)
    }/${project?.maxSupply || project?.limit}`;
  }, [project]);

  const isHasBtcWallet = useMemo(() => {
    return Boolean(
      project?.creatorProfile?.walletAddressBtcTaproot ||
        project?.creatorProfile?.walletAddress
    );
  }, [project]);

  const creatorAddress = useMemo((): string => {
    return String(
      project?.creatorProfile?.walletAddressBtcTaproot ||
        project?.creatorProfile?.walletAddress
    );
  }, [project]);

  const projectName = useMemo((): string => {
    return project?.fromAuthentic || false
      ? wordCase(`Ordinal ${project?.name} `)
      : `${project?.name} `;
  }, [project]);

  const hasReported = useMemo(() => {
    if (!project?.reportUsers || !user) return false;

    const reportedAddressList = project?.reportUsers.map(
      item => item.reportUserAddress
    );

    return reportedAddressList.includes(user?.walletAddress || '');
  }, [project?.reportUsers]);

  const showReportMsg = useMemo(() => {
    if (
      project?.reportUsers &&
      project?.reportUsers.length >= REPORT_COUNT_THRESHOLD
    )
      return true;
    return false;
  }, [project?.reportUsers]);

  const fetchAllCategory = async () => {
    try {
      const { result } = await getCategoryList();
      setCategoryList(result);
    } catch (err: unknown) {
      log('failed to fetch category list', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useAsyncEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    handleFetchMarketplaceStats();
  }, [projectDetail]);

  useEffect(() => {
    if (errorMessage) {
      toast.remove();
      toast.error(ErrorMessage.DEFAULT);
      resetMintToken();
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!project) return;
    const _projectDetail = base64ToUtf8(
      project.projectURI.replace('data:application/json;base64,', '')
    );
    if (_projectDetail) {
      let projectDetailJSON = _projectDetail;
      if (!isBitcoinProject) {
        projectDetailJSON = escapeSpecialChars(_projectDetail);
      }
      const projectDetailObj = JSON.parse(projectDetailJSON);
      setProjectDetail(projectDetailObj);
    }
  }, [project?.id]);

  const categoryName = useMemo(() => {
    if (project && project?.categories?.length) {
      for (let i = 0; i < categoryList.length; i++) {
        if (project.categories[0] === categoryList[i].id) {
          return categoryList[i].name;
        }
      }
    }
    return null;
  }, [project, categoryList]);

  const contextValues = useMemo((): IProjectLayoutContext => {
    return {
      project,
      isHasBtcWallet,
      creatorAddress,
      isTwVerified,
      isCreated,
      projectName,
      isEdit,
      minted,
      isRoyalty,
      mintedDate,
      isFullonChain,
      hasProjectInteraction,
      showReportModal,
      setShowReportModal,
      showReportMsg,
      isMinting,
      isAvailable,
      hasReported,
      isLimitMinted,
      priceMemo,
      priceEthMemo,
      textMint,
      handleMintToken,
      onHandlePaymentWithWallet,
      isBitcoinProject,
      marketplaceStats,
      projectDetail,
      isWhitelist,
      openMintBTCModal,
      origin,
      hasMint,
      categoryName,
    };
  }, [
    project,
    isHasBtcWallet,
    creatorAddress,
    isTwVerified,
    isCreated,
    projectName,
    isEdit,
    minted,
    isRoyalty,
    mintedDate,
    isFullonChain,
    hasProjectInteraction,
    showReportModal,
    setShowReportModal,
    showReportMsg,
    isMinting,
    isAvailable,
    hasReported,
    isLimitMinted,
    priceMemo,
    priceEthMemo,
    textMint,
    handleMintToken,
    onHandlePaymentWithWallet,
    isBitcoinProject,
    marketplaceStats,
    projectDetail,
    isWhitelist,
    openMintBTCModal,
    origin,
    hasMint,
    categoryName,
  ]);

  return (
    <ProjectLayoutContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </ProjectLayoutContext.Provider>
  );
};
