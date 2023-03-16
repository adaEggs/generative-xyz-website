import { NETWORK_CHAIN_ID } from '@constants/config';
import {
  GENERATIVE_MARKETPLACE_CONTRACT,
  GENERATIVE_PROJECT_CONTRACT,
  MAX_HEX_VALUE,
  WETH_ADDRESS,
} from '@constants/contract-address';
import { ErrorMessage } from '@enums/error-message';
import { ListingStep } from '@enums/listing-generative';
import { LogLevel } from '@enums/log-level';
import useContractOperation from '@hooks/useContractOperation';
import { MarketplaceStats } from '@interfaces/marketplace';
import { Token, TokenActivities, TokenOffer } from '@interfaces/token';
import { getUserSelector } from '@redux/user/selector';
import ApproveTokenAmountOperation from '@services/contract-operations/erc20/approve-token-amount';
import GetAllowanceAmountOperation from '@services/contract-operations/erc20/get-allowance-amount';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import AcceptTokenOfferOperation from '@services/contract-operations/generative-marketplace/accept-token-offer';
import CancelListingTokenOperation from '@services/contract-operations/generative-marketplace/cancel-listing-token';
import CancelTokenOfferOperation from '@services/contract-operations/generative-marketplace/cancel-token-offer';
import ListingToSaleTokenOperation from '@services/contract-operations/generative-marketplace/list-to-sale-token';
import MakeTokenOfferOperation from '@services/contract-operations/generative-marketplace/make-token-offer';
import PurchaseTokenOperation from '@services/contract-operations/generative-marketplace/purchase-token';
import IsApprrovedForAllOperation from '@services/contract-operations/generative-nft/is-approved-for-all';
import SetApprrovalForAllOperation from '@services/contract-operations/generative-nft/set-approval-for-all';
import TransferTokenOperation from '@services/contract-operations/generative-nft/transfer-token';
import DepositWETHOperation from '@services/contract-operations/weth/deposit-weth';
import WithdrawWETHOperation from '@services/contract-operations/weth/withdraw-weth';
import {
  getListing,
  getMakeOffers,
  getMarketplaceStats,
} from '@services/marketplace';
import { getTokenActivities } from '@services/nfts';
import { getTokenUri } from '@services/token-uri';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import useAsyncEffect from 'use-async-effect';
import { checkIsBitcoinProject } from '@utils/generative';
import { getProjectDetail } from '@services/project';
import { Project } from '@interfaces/project';

const LOG_PREFIX = 'GenerativeTokenDetailContext';

export interface IGenerativeTokenDetailContext {
  tokenData: Token | null;
  setTokenData: Dispatch<SetStateAction<Token | null>>;
  tokenActivities: TokenActivities | null;
  showListingModal: boolean;
  openListingModal: () => void;
  hideListingModal: () => void;
  handleListingToken: (_: string) => Promise<void>;
  marketplaceStats: MarketplaceStats | null;
  setMarketplaceStats: Dispatch<SetStateAction<MarketplaceStats | null>>;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  listingStep: ListingStep;
  setListingStep: Dispatch<SetStateAction<ListingStep>>;
  listingOffers: Array<TokenOffer>;
  listingPrice: number;
  setListingPrice: Dispatch<SetStateAction<number>>;
  txHash: string | null;
  setTxHash: Dispatch<SetStateAction<string | null>>;
  handlePurchaseToken: (_: TokenOffer) => Promise<void>;
  tokenID: string;
  tokenOffers: Array<TokenOffer>;
  isTokenOwner: boolean;
  isTokenListing: boolean;
  showMakeOfferModal: boolean;
  openMakeOfferModal: () => void;
  hideMakeOffergModal: () => void;
  handleMakeTokenOffer: (_price: string, _duration: number) => Promise<void>;
  handleAcceptOffer: (_: TokenOffer) => Promise<void>;
  handleCancelOffer: (_: TokenOffer) => Promise<void>;
  handleTransferToken: (_tokenID: string, _addr: string) => Promise<void>;
  showCancelListingModal: { open: boolean; offer: TokenOffer | null };
  openCancelListingModal: (_: TokenOffer) => void;
  hideCancelListingModal: () => void;
  handleCancelListingOffer: (_: TokenOffer) => Promise<void>;
  showTransferTokenModal: boolean;
  openTransferTokenModal: () => void;
  hideTransferTokenModal: () => void;
  showSwapTokenModal: boolean;
  openSwapTokenModal: () => void;
  hideSwapTokenModal: () => void;
  handleDepositToken: (_amount: string) => Promise<void>;
  handleWithdrawToken: (_amount: string) => Promise<void>;
  wethBalance: number | null;
  isBitcoinProject: boolean;
  projectData: Project | null;
}

const initialValue: IGenerativeTokenDetailContext = {
  tokenData: null,
  setTokenData: _ => {
    return;
  },
  tokenActivities: null,
  showListingModal: false,
  openListingModal: () => {
    return;
  },
  hideListingModal: () => {
    return;
  },
  handleListingToken: _ => new Promise(r => r()),
  listingStep: ListingStep.INPUT_INFO,
  setListingStep: _ => {
    return;
  },
  marketplaceStats: null,
  setMarketplaceStats: () => {
    return;
  },
  listingPrice: 0,
  setListingPrice: _ => {
    return;
  },
  listingOffers: [],
  errorMessage: null,
  setErrorMessage: _ => {
    return;
  },
  txHash: null,
  setTxHash: _ => {
    return;
  },
  handlePurchaseToken: _ => new Promise(r => r()),
  tokenID: '',
  tokenOffers: [],
  isTokenOwner: false,
  isTokenListing: false,
  showMakeOfferModal: false,
  openMakeOfferModal: () => {
    return;
  },
  hideMakeOffergModal: () => {
    return;
  },
  handleMakeTokenOffer: (_p: string, _d: number) => new Promise(r => r()),
  handleAcceptOffer: _ => new Promise(r => r()),
  handleCancelOffer: _ => new Promise(r => r()),
  handleTransferToken: (_tokenID, _addr) => new Promise(r => r()),
  showCancelListingModal: { open: false, offer: null },
  openCancelListingModal: _ => {
    return;
  },
  hideCancelListingModal: () => {
    return;
  },
  handleCancelListingOffer: _ => new Promise(r => r()),
  showTransferTokenModal: false,
  openTransferTokenModal: () => {
    return;
  },
  hideTransferTokenModal: () => {
    return;
  },
  showSwapTokenModal: false,
  openSwapTokenModal: () => {
    return;
  },
  hideSwapTokenModal: () => {
    return;
  },
  handleDepositToken: _ => new Promise(r => r()),
  handleWithdrawToken: _ => new Promise(r => r()),
  wethBalance: null,
  isBitcoinProject: false,
  projectData: null,
};

export const GenerativeTokenDetailContext =
  createContext<IGenerativeTokenDetailContext>(initialValue);

export const GenerativeTokenDetailProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [tokenData, setTokenData] = useState<Token | null>(null);
  const [tokenOffers, setTokenOffers] = useState<Array<TokenOffer>>([]);
  const [tokenActivities, setTokenActivities] =
    useState<TokenActivities | null>(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [showTransferTokenModal, setShowTransferTokenModal] = useState(false);
  const [showSwapTokenModal, setShowSwapTokenModal] = useState(false);
  const [showCancelListingModal, setShowCancelListingModal] = useState<{
    open: boolean;
    offer: TokenOffer | null;
  }>({ open: false, offer: null });
  const [listingStep, setListingStep] = useState(ListingStep.INPUT_INFO);
  const [listingPrice, setListingPrice] = useState(0);
  const [listingOffers, setListingOffers] = useState<Array<TokenOffer>>([]);
  const [marketplaceStats, setMarketplaceStats] =
    useState<MarketplaceStats | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [wethBalance, setWETHBalance] = useState<number | null>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);

  const user = useSelector(getUserSelector);
  const { call: listToken } = useContractOperation(
    ListingToSaleTokenOperation,
    true
  );
  const { call: checkTokenIsApproved } = useContractOperation(
    IsApprrovedForAllOperation,
    false
  );
  const { call: setApprovalForAll } = useContractOperation(
    SetApprrovalForAllOperation,
    true
  );
  const { call: purchaseToken } = useContractOperation(
    PurchaseTokenOperation,
    true
  );
  const { call: makeTokenOffer } = useContractOperation(
    MakeTokenOfferOperation,
    true
  );
  const { call: approveTokenAmount } = useContractOperation(
    ApproveTokenAmountOperation,
    true
  );
  const { call: getAllowanceAmount } = useContractOperation(
    GetAllowanceAmountOperation,
    true
  );
  const { call: acceptOffer } = useContractOperation(
    AcceptTokenOfferOperation,
    true
  );
  const { call: cancelOffer } = useContractOperation(
    CancelTokenOfferOperation,
    true
  );
  const { call: transferToken } = useContractOperation(
    TransferTokenOperation,
    true
  );
  const { call: cancelListingToken } = useContractOperation(
    CancelListingTokenOperation,
    true
  );
  const { call: depositWETH } = useContractOperation(
    DepositWETHOperation,
    true
  );
  const { call: withdrawWETH } = useContractOperation(
    WithdrawWETHOperation,
    true
  );
  const { call: getTokenBalance } = useContractOperation(
    GetTokenBalanceOperation,
    false
  );
  const router = useRouter();
  const { projectID, tokenID } = router.query as {
    projectID: string;
    tokenID: string;
  };

  const isBitcoinProject = useMemo((): boolean => {
    if (!tokenData?.project) return false;
    return checkIsBitcoinProject(tokenData?.project.tokenID);
  }, [tokenData?.project]);

  const openListingModal = (): void => {
    setShowListingModal(true);
    document.body.style.overflow = 'hidden';
  };

  const hideListingModal = (): void => {
    // Reset state
    setShowListingModal(false);
    setListingStep(ListingStep.INPUT_INFO);
    setTxHash(null);
    setListingPrice(0);

    // Recover scroll behavior
    document.body.style.overflow = 'auto';
  };

  const openMakeOfferModal = (): void => {
    setShowMakeOfferModal(true);
    document.body.style.overflow = 'hidden';
  };

  const hideMakeOffergModal = (): void => {
    // Reset state
    setShowMakeOfferModal(false);
    setTxHash(null);

    // Recover scroll behavior
    document.body.style.overflow = 'auto';
  };

  const openCancelListingModal = (offer: TokenOffer): void => {
    setShowCancelListingModal({ open: true, offer });
    document.body.style.overflow = 'hidden';
  };

  const hideCancelListingModal = (): void => {
    // Reset state
    setShowCancelListingModal({ open: false, offer: null });
    setTxHash(null);

    // Recover scroll behavior
    document.body.style.overflow = 'auto';
  };

  const openTransferTokenModal = (): void => {
    setShowTransferTokenModal(true);
    document.body.style.overflow = 'hidden';
  };

  const hideTransferTokenModal = (): void => {
    // Reset state
    setShowTransferTokenModal(false);
    setTxHash(null);

    // Recover scroll behavior
    document.body.style.overflow = 'auto';
  };

  const openSwapTokenModal = (): void => {
    setShowSwapTokenModal(true);
    document.body.style.overflow = 'hidden';
  };

  const hideSwapTokenModal = (): void => {
    // Reset state
    setShowSwapTokenModal(false);
    setTxHash(null);

    // Recover scroll behavior
    document.body.style.overflow = 'auto';
  };

  const handleListingToken = async (price: string): Promise<void> => {
    setErrorMessage(null);

    if (!tokenData) {
      return;
    }

    // Check if token's already been approved
    const isTokenApproved = await checkTokenIsApproved({
      marketplaceAddress: GENERATIVE_MARKETPLACE_CONTRACT,
      chainID: NETWORK_CHAIN_ID,
      collectionAddress: tokenData.genNFTAddr,
    });
    if (isTokenApproved === null) {
      setErrorMessage('Transaction rejected.');
      log('listing token transaction error.', LogLevel.ERROR, LOG_PREFIX);
      return;
    }
    if (!isTokenApproved) {
      const status = await setApprovalForAll({
        marketplaceAddress: GENERATIVE_MARKETPLACE_CONTRACT,
        chainID: NETWORK_CHAIN_ID,
        collectionAddress: tokenData.genNFTAddr,
      });
      if (!status) {
        setErrorMessage('Transaction rejected.');
        log('listing token transaction error.', LogLevel.ERROR, LOG_PREFIX);
        return;
      }
    }

    const tx = await listToken({
      collectionAddress: tokenData.genNFTAddr,
      tokenID: tokenData.tokenID,
      durationTime: 0,
      price: price,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      setErrorMessage(ErrorMessage.DEFAULT);
      log('listing token transaction error.', LogLevel.ERROR, LOG_PREFIX);
      return;
    } else {
      setListingStep(ListingStep.SUCCESS);
      setTxHash(tx.transactionHash);

      // Refresh listing offers
      fetchListingTokenOffers();
    }
  };

  const handlePurchaseToken = async (offer: TokenOffer): Promise<void> => {
    if (!offer.offeringID || !offer.price) {
      return;
    }

    const tx = await purchaseToken({
      offerId: offer.offeringID,
      price: offer.price,
      chainID: NETWORK_CHAIN_ID,
    });
    if (!tx) {
      toast.error(ErrorMessage.DEFAULT);
      log('purchase token transaction error.', LogLevel.ERROR, LOG_PREFIX);
    } else {
      toast.success('You has bought this art successfully');

      // Reload token data to update owner
      fetchTokenData();
    }
  };

  const handleMakeTokenOffer = async (price: string, durationTime: number) => {
    if (!tokenData) {
      return;
    }

    const allowanceAmount = await getAllowanceAmount({
      consumerAddress: GENERATIVE_MARKETPLACE_CONTRACT,
      chainID: NETWORK_CHAIN_ID,
      contractAddress: WETH_ADDRESS,
    });

    if (allowanceAmount === null) {
      log('Can not get allowanceAmount.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    if (BigInt(allowanceAmount) < BigInt(MAX_HEX_VALUE)) {
      const approveTokenTx = await approveTokenAmount({
        contractAddress: WETH_ADDRESS,
        chainID: NETWORK_CHAIN_ID,
        consumerAddress: GENERATIVE_MARKETPLACE_CONTRACT,
      });

      if (!approveTokenTx) {
        log('User rejected WETH permission.', LogLevel.ERROR, LOG_PREFIX);
        throw Error(ErrorMessage.DEFAULT);
      }
    }

    const tx = await makeTokenOffer({
      collectionAddress: tokenData.genNFTAddr,
      tokenID: tokenData.tokenID,
      durationTime: durationTime,
      price: price,
      erc20Token: WETH_ADDRESS,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Make token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    hideMakeOffergModal();

    // Refresh offers data
    fetchTokenOffers();
  };

  const handleAcceptOffer = async (offer: TokenOffer): Promise<void> => {
    if (!tokenData) {
      return;
    }

    // Check if token's already been approved
    const isTokenApproved = await checkTokenIsApproved({
      marketplaceAddress: GENERATIVE_MARKETPLACE_CONTRACT,
      chainID: NETWORK_CHAIN_ID,
      collectionAddress: tokenData.genNFTAddr,
    });
    if (isTokenApproved === null) {
      setErrorMessage('Transaction rejected.');
      log('listing token transaction error.', LogLevel.ERROR, LOG_PREFIX);
      return;
    }
    if (!isTokenApproved) {
      const status = await setApprovalForAll({
        marketplaceAddress: GENERATIVE_MARKETPLACE_CONTRACT,
        chainID: NETWORK_CHAIN_ID,
        collectionAddress: tokenData.genNFTAddr,
      });
      if (!status) {
        setErrorMessage('Transaction rejected.');
        log('listing token transaction error.', LogLevel.ERROR, LOG_PREFIX);
        return;
      }
    }

    // Accept offer
    const tx = await acceptOffer({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Accept token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    fetchTokenOffers();
  };

  const handleCancelOffer = async (offer: TokenOffer): Promise<void> => {
    const tx = await cancelOffer({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Cancel token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    fetchTokenOffers();
  };

  const handleTransferToken = async (
    tokenID: string,
    toAddress: string
  ): Promise<void> => {
    if (!tokenData) {
      return;
    }

    const tx = await transferToken({
      chainID: NETWORK_CHAIN_ID,
      toAddress,
      tokenID,
      collectionAddress: tokenData?.genNFTAddr,
    });

    if (!tx) {
      log('Cancel token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    fetchTokenData();
  };

  const handleCancelListingOffer = async (offer: TokenOffer): Promise<void> => {
    const tx = await cancelListingToken({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log(
        'Cancel listing token offer transaction error.',
        LogLevel.ERROR,
        LOG_PREFIX
      );
      throw Error(ErrorMessage.DEFAULT);
    }

    hideCancelListingModal();

    // Refresh offers data
    fetchListingTokenOffers();
  };

  const handleDepositToken = async (amount: string): Promise<void> => {
    const tx = await depositWETH({
      amount,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Deposit weth transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    hideSwapTokenModal();
  };

  const handleWithdrawToken = async (amount: string): Promise<void> => {
    const tx = await withdrawWETH({
      amount,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Withdraw weth transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    hideSwapTokenModal();
  };

  const fetchTokenData = async (): Promise<void> => {
    try {
      if (tokenID) {
        const res = await getTokenUri({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          tokenID,
        });
        setTokenData(res);
      }
    } catch (err: unknown) {
      log('failed to fetch item detail', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const fetchTokenOffers = async () => {
    try {
      if (tokenData && tokenData.genNFTAddr && tokenID) {
        const { result } = await getMakeOffers({
          genNFTAddr: tokenData.genNFTAddr,
          tokenId: tokenID,
          closed: false,
        });
        if (result) {
          setTokenOffers(result);
        }
      }
    } catch (e) {
      log('can not fetch offers', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const fetchMarketplaceStats = async () => {
    try {
      if (tokenData && tokenData?.genNFTAddr) {
        const res = await getMarketplaceStats({
          collectionAddr: tokenData?.genNFTAddr,
        });
        if (res) setMarketplaceStats(res?.stats);
      }
    } catch (e) {
      log('can not fetch price', LogLevel.ERROR, '');
    }
  };

  const fetchListingTokenOffers = async () => {
    try {
      if (tokenData && tokenData.genNFTAddr) {
        const listingTokens = await getListing(
          {
            genNFTAddr: tokenData.genNFTAddr,
            tokenId: tokenID,
          },
          {
            closed: false,
            sort_by: 'newest',
            sort: -1,
          }
        );
        if (listingTokens && listingTokens.result[0]) {
          setListingOffers(listingTokens.result);
          setListingPrice(
            Number(Web3.utils.fromWei(listingTokens.result[0].price, 'ether'))
          );
        }
      }
    } catch (e) {
      log('can not fetch price', LogLevel.ERROR, '');
    }
  };

  const fetchTokenActivities = async () => {
    try {
      if (tokenData && tokenData.genNFTAddr) {
        const res = await getTokenActivities({
          inscription_id: tokenData.tokenID,
          limit: 20,
        });
        if (res) setTokenActivities(res);
      }
    } catch (err: unknown) {
      log('failed to ', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const fetchProjectDetail = async (): Promise<void> => {
    if (projectID) {
      try {
        const data = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID: projectID,
        });
        setProjectData(data);
      } catch (_: unknown) {
        log('failed to fetch project detail data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  const isTokenOwner = useMemo(() => {
    if (!user?.walletAddress || !tokenData?.ownerAddr) return false;
    return user.walletAddress === tokenData?.ownerAddr;
  }, [tokenData, user]);

  const isTokenListing = useMemo(() => {
    if (
      !user?.walletAddress ||
      !listingOffers ||
      listingOffers.length === 0 ||
      listingOffers[0].seller !== tokenData?.ownerAddr
    )
      return false;
    return listingOffers.length > 0;
  }, [user, listingOffers]);

  useEffect(() => {
    fetchTokenData();
  }, [tokenID]);

  useEffect(() => {
    fetchTokenOffers();
    fetchListingTokenOffers();
    fetchMarketplaceStats();
    fetchTokenActivities();
  }, [tokenData]);

  useEffect(() => {
    fetchProjectDetail();
  }, [projectID]);

  useAsyncEffect(async () => {
    if (!showSwapTokenModal) {
      setWETHBalance(null);
      const balance = await getTokenBalance({
        chainID: NETWORK_CHAIN_ID,
        erc20TokenAddress: WETH_ADDRESS,
      });
      if (balance) {
        setWETHBalance(parseFloat(Web3.utils.fromWei(balance.toString())));
      }
    }
  }, [user, tokenData, showSwapTokenModal]);

  const contextValues = useMemo((): IGenerativeTokenDetailContext => {
    return {
      tokenData,
      setTokenData,
      tokenActivities,
      showListingModal,
      handleListingToken,
      marketplaceStats,
      setMarketplaceStats,
      listingStep,
      setListingStep,
      listingOffers,
      listingPrice,
      setListingPrice,
      openListingModal,
      hideListingModal,
      errorMessage,
      setErrorMessage,
      txHash,
      setTxHash,
      handlePurchaseToken,
      tokenID,
      tokenOffers,
      isTokenOwner,
      isTokenListing,
      showMakeOfferModal,
      openMakeOfferModal,
      hideMakeOffergModal,
      handleMakeTokenOffer,
      handleAcceptOffer,
      handleCancelOffer,
      handleTransferToken,
      showCancelListingModal,
      openCancelListingModal,
      hideCancelListingModal,
      handleCancelListingOffer,
      showTransferTokenModal,
      openTransferTokenModal,
      hideTransferTokenModal,
      showSwapTokenModal,
      openSwapTokenModal,
      hideSwapTokenModal,
      handleDepositToken,
      handleWithdrawToken,
      wethBalance,
      isBitcoinProject,
      projectData,
    };
  }, [
    tokenData,
    setTokenData,
    showListingModal,
    handleListingToken,
    marketplaceStats,
    setMarketplaceStats,
    listingOffers,
    listingStep,
    setListingStep,
    listingPrice,
    setListingPrice,
    openListingModal,
    hideListingModal,
    errorMessage,
    setErrorMessage,
    txHash,
    setTxHash,
    handlePurchaseToken,
    tokenID,
    tokenOffers,
    isTokenOwner,
    isTokenListing,
    showMakeOfferModal,
    openMakeOfferModal,
    hideMakeOffergModal,
    handleMakeTokenOffer,
    handleAcceptOffer,
    handleCancelOffer,
    handleTransferToken,
    showCancelListingModal,
    openCancelListingModal,
    hideCancelListingModal,
    handleCancelListingOffer,
    showTransferTokenModal,
    openTransferTokenModal,
    hideTransferTokenModal,
    showSwapTokenModal,
    openSwapTokenModal,
    hideSwapTokenModal,
    handleDepositToken,
    handleWithdrawToken,
    wethBalance,
    isBitcoinProject,
    projectData,
  ]);

  return (
    <GenerativeTokenDetailContext.Provider value={contextValues}>
      {children}
    </GenerativeTokenDetailContext.Provider>
  );
};
