import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import { ROUTE_PATH } from '@constants/route-path';
import { LogLevel } from '@enums/log-level';
import { IGetTokenActivitiesResponse } from '@interfaces/api/nfts';
import {
  IProjectMarketplaceData,
  IProjectMintFeeRate,
} from '@interfaces/api/project';
import { Project, ProjectItemsTraitList } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { useAppSelector } from '@redux';
import { setProjectCurrent } from '@redux/project/action';
import { getUserSelector } from '@redux/user/selector';
import { getTokenActivities } from '@services/nfts';
import {
  getProjectDetail,
  getProjectItems,
  getProjectItemsTraitsList,
  getProjectMintFeeRate,
  projectMarketplaceData,
} from '@services/project';
import { checkIsBitcoinProject } from '@utils/generative';
import log from '@utils/logger';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import useAsyncEffect from 'use-async-effect';

const LOG_PREFIX = 'GenerativeProjectDetailContext';

const FETCH_NUM = 30;

export interface IGenerativeProjectDetailContext {
  projectData: Project | null;
  projectFeeRate: IProjectMintFeeRate | null;
  debounceFetchProjectFeeRate: (projectData?: Project, rate?: number) => void;

  setProjectData: Dispatch<SetStateAction<Project | null>>;
  listItems: Token[] | null;
  listItemsBuyable: Token[] | null;
  setListItems: Dispatch<SetStateAction<Token[] | null>>;
  selectedOrders: string[];
  selectOrders: (length: number) => void;
  selectAllOrders: () => void;
  removeAllOrders: () => void;
  addSelectedOrder: (oderId: string) => void;
  removeSelectedOrder: (oderId: string) => void;
  handleFetchNextPage: () => void;
  searchToken: string;
  setSearchToken: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  total: number;
  filterBuyNow: boolean;
  setFilterBuyNow: Dispatch<SetStateAction<boolean>>;
  isLoaded: boolean;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  isNextPageLoaded: boolean;
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  filterTraits: string;
  setFilterTraits: Dispatch<SetStateAction<string>>;
  projectItemsTraitList: ProjectItemsTraitList | null;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  filterPrice: {
    from: string;
    to: string;
  };
  setFilterPrice: Dispatch<
    React.SetStateAction<{
      from: string;
      to: string;
    }>
  >;
  filterRarity: {
    from: string;
    to: string;
  };
  setFilterRarity: Dispatch<
    React.SetStateAction<{
      from: string;
      to: string;
    }>
  >;
  isShowMintBTCModal: boolean;
  showMintBTCModal: () => void;
  hideMintBTCModal: () => void;
  isBitcoinProject: boolean;
  isWhitelistProject: boolean;
  isSatoshisPage: boolean;
  marketplaceData: IProjectMarketplaceData | null;
  setMarketplaceData: (data: IProjectMarketplaceData) => void;
  isLimitMinted: boolean;
  collectionActivities: IGetTokenActivitiesResponse | null;
  setFilterActivities: Dispatch<SetStateAction<string>>;
  isLayoutShop: boolean;
  setIsLayoutShop: Dispatch<SetStateAction<boolean>>;
}

const initialValue: IGenerativeProjectDetailContext = {
  projectData: null,
  projectFeeRate: null,
  debounceFetchProjectFeeRate: () => {
    return;
  },
  setProjectData: _ => {
    return;
  },
  listItems: null,
  listItemsBuyable: null,
  setListItems: _ => {
    return;
  },
  selectedOrders: [],
  selectOrders: () => {
    return;
  },
  selectAllOrders: () => {
    return;
  },
  removeAllOrders: () => {
    return;
  },
  addSelectedOrder: () => {
    return;
  },
  removeSelectedOrder: () => {
    return;
  },
  handleFetchNextPage: () => {
    return;
  },
  searchToken: '',
  setSearchToken: _ => {
    return;
  },
  sort: '',
  setSort: _ => {
    return;
  },
  total: 0,
  filterBuyNow: false,
  setFilterBuyNow: _ => {
    return;
  },
  setIsLoaded: _ => {
    return;
  },
  isLoaded: false,
  isNextPageLoaded: true,
  showFilter: false,
  setShowFilter: _ => {
    return;
  },
  filterTraits: '',
  setFilterTraits: _ => {
    return;
  },
  page: 1,
  setPage: _ => {
    return;
  },
  filterPrice: {
    from: '',
    to: '',
  },
  setFilterPrice: _ => {
    return;
  },
  filterRarity: {
    from: '',
    to: '',
  },
  setFilterRarity: _ => {
    return;
  },
  isShowMintBTCModal: false,
  showMintBTCModal: () => {
    return;
  },
  hideMintBTCModal: () => {
    return;
  },
  isBitcoinProject: false,
  isWhitelistProject: false,
  isSatoshisPage: false,
  marketplaceData: null,
  setMarketplaceData: _data => {
    return;
  },
  isLimitMinted: false,
  collectionActivities: null,
  setFilterActivities: _ => {
    return;
  },
  isLayoutShop: false,
  setIsLayoutShop: _ => {
    return;
  },
  projectItemsTraitList: null,
};

export const GenerativeProjectDetailContext =
  createContext<IGenerativeProjectDetailContext>(initialValue);

export const GenerativeProjectDetailProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);

  const dispatch = useDispatch();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [marketplaceData, setMarketplaceData] =
    useState<IProjectMarketplaceData | null>(null);
  const [projectFeeRate, setProjectFeeRate] =
    useState<IProjectMintFeeRate | null>(null);
  const currentCustomFeeRate = React.useRef<number | null>();

  const [listItems, setListItems] = useState<Token[] | null>(null);
  const [collectionActivities, setCollectionActivities] =
    useState<IGetTokenActivitiesResponse | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('price-asc');
  const [filterBuyNow, setFilterBuyNow] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isShowMintBTCModal, setIsShowMintBTCModal] = useState<boolean>(false);
  const [isNextPageLoaded, setIsNextPageLoaded] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterTraits, setFilterTraits] = useState('');
  const [filterPrice, setFilterPrice] = useState({
    from: '',
    to: '',
  });
  const [filterRarity, setFilterRarity] = useState({
    from: '',
    to: '',
  });

  const [filterActivities, setFilterActivities] = useState('1,2,3');
  const [isLayoutShop, setIsLayoutShop] = useState<boolean>(false);

  const [projectItemsTraitList, setProjectItemsTraitList] =
    useState<ProjectItemsTraitList | null>(null);
  const router = useRouter();

  const { projectID } = router?.query as {
    projectID: string;
  };

  const isWhitelistProject = useMemo(() => {
    return router.pathname === ROUTE_PATH.SATOSHIS_FREE_MINT;
  }, []);

  const isSatoshisPage = useMemo(() => {
    return router.pathname === ROUTE_PATH.SATOSHIS_PAGE;
  }, []);

  const isLimitMinted = useMemo((): boolean => {
    if (!projectData) return false;
    return projectData?.mintingInfo?.index < projectData?.maxSupply;
  }, [projectData]);

  const listItemsBuyable = useMemo(() => {
    if (!listItems) return [];
    return listItems.filter(item => item.buyable && item.sell_verified);
  }, [listItems]);

  const handleFetchNextPage = () => {
    setPage(prev => prev + 1);
  };

  const showMintBTCModal = () => {
    document.body.style.overflow = 'hidden';
    setIsShowMintBTCModal(true);
  };

  const hideMintBTCModal = () => {
    document.body.style.overflow = 'auto';
    setIsShowMintBTCModal(false);
  };

  const addSelectedOrder = (orderId: string) => {
    setSelectedOrders(prev => [...prev, orderId]);
  };

  const removeSelectedOrder = (orderId: string) => {
    setSelectedOrders(prev => prev.filter(_orderId => _orderId !== orderId));
  };

  const selectOrders = (length: number) => {
    if (listItems && listItems.length > 0) {
      setSelectedOrders(
        listItemsBuyable.slice(0, length).map(item => item.orderID)
      );
    }
  };

  const selectAllOrders = () => {
    if (listItems && listItems.length > 0) {
      setSelectedOrders(listItemsBuyable.map(item => item.orderID));
    }
  };

  const removeAllOrders = () => {
    setSelectedOrders([]);
  };

  const fetchProjectDetail = async (): Promise<void> => {
    if (projectID || isSatoshisPage) {
      try {
        const data = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID: isSatoshisPage ? SATOSHIS_PROJECT_ID : projectID,
          userAddress: user?.walletAddressBtcTaproot,
        });
        dispatch(setProjectCurrent(data));
        setProjectData(data);

        debounceFetchProjectFeeRate(data, 0);
      } catch (_: unknown) {
        log('failed to fetch project detail data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  const fetchProjectFeeRate = useCallback(
    async (projData?: Project, rate?: number): Promise<void> => {
      const isReserveUser =
        projData?.reservers &&
        projData?.reservers.length > 0 &&
        user &&
        user.walletAddressBtcTaproot &&
        projData?.reservers.includes(user.walletAddressBtcTaproot);

      try {
        const data = await getProjectMintFeeRate(
          projData ? projData.maxFileSize : 0,
          rate,
          projData
            ? isReserveUser
              ? Number(projData.reserveMintPrice)
              : Number(projData.mintPrice)
            : 0
        );
        setProjectFeeRate(data);
        currentCustomFeeRate.current = rate;
      } catch (_: unknown) {
        log(
          'failed to fetch project fee rate data',
          LogLevel.ERROR,
          LOG_PREFIX
        );
      }
    },
    [user]
  );

  const debounceFetchProjectFeeRate = debounce(fetchProjectFeeRate, 300);

  const fetchProjectItems = async (): Promise<void> => {
    if (projectData?.genNFTAddr && !isWhitelistProject) {
      try {
        if (page > 1) {
          setIsNextPageLoaded(false);
        } else {
          setIsLoaded(false);
        }

        const rarityMin = filterRarity?.from || '1';
        const rarityMax = filterRarity?.to || '100';

        const res = await getProjectItems(
          {
            contractAddress: projectData.genNFTAddr,
          },
          {
            limit: FETCH_NUM,
            page: page,
            sort,
            keyword: searchToken || '',
            attributes: filterTraits || '',
            is_buy_now: filterBuyNow || '',
            from_price: filterPrice.from || '',
            to_price: filterPrice.to || '',
            rarity: `${rarityMin},${rarityMax}`,
          }
        );
        if (res.result) {
          if (page === 1) {
            setListItems(res.result);
          } else {
            listItems && setListItems([...listItems, ...res.result]);
          }
          setTotal(res.total);
        }
        setIsLoaded(true);
        setIsNextPageLoaded(true);
      } catch (_: unknown) {
        log('failed to fetch project items data', LogLevel.ERROR, LOG_PREFIX);
      }
    } else {
      setIsLoaded(true);
      setIsNextPageLoaded(true);
      setTotal(0);
      setListItems([]);
    }
  };

  const fetchWhitelistProjectItems = async (): Promise<void> => {
    if (isWhitelistProject || isSatoshisPage) {
      try {
        if (page > 1) {
          setIsNextPageLoaded(false);
        } else {
          setIsLoaded(false);
        }

        const rarityMin = filterRarity?.from || '1';
        const rarityMax = filterRarity?.to || '100';

        const res = await getProjectItems(
          {
            contractAddress: SATOSHIS_PROJECT_ID,
          },
          {
            limit: FETCH_NUM,
            page: page,
            sort,
            keyword: searchToken || '',
            attributes: filterTraits || '',
            has_price: filterBuyNow || '',
            from_price: filterPrice.from || '',
            to_price: filterPrice.to || '',
            rarity: `${rarityMin},${rarityMax}`,
          }
        );
        if (res.result) {
          if (page === 1) {
            setListItems(res.result);
          } else {
            listItems && setListItems([...listItems, ...res.result]);
          }
          setTotal(res.total);
        }
        setIsLoaded(true);
        setIsNextPageLoaded(true);
      } catch (_: unknown) {
        log('failed to fetch project items data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  const fetchProjectItemsTraitsList = async (): Promise<void> => {
    try {
      if (projectID) {
        const res = await getProjectItemsTraitsList({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID: projectID,
        });
        if (res) {
          setProjectItemsTraitList(res);
        }
      }
    } catch (err: unknown) {
      log('failed to ', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const fetchProjectActivities = async (): Promise<void> => {
    try {
      if (projectID) {
        const res = await getTokenActivities({
          project_id: projectID,
          limit: 100,
          types: filterActivities,
        });
        if (res) {
          setCollectionActivities(res);
        }
      }
    } catch (err: unknown) {
      log('failed to get project activities', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  useEffect(() => {
    fetchProjectDetail();
    fetchProjectItemsTraitsList();
    fetchProjectActivities();
  }, [projectID]);

  useEffect(() => {
    if (projectData && projectData.btcFloorPrice > 0) {
      setFilterBuyNow(false);
    }
  }, [projectData]);

  useEffect(() => {
    fetchProjectActivities();
  }, [filterActivities]);

  useEffect(() => {
    if (user && user.walletAddressBtcTaproot) {
      fetchProjectDetail();
    }
  }, [user?.walletAddressBtcTaproot]);

  useEffect(() => {
    if (
      filterPrice.to &&
      parseFloat(filterPrice.to) < parseFloat(filterPrice.from)
    ) {
      toast.error('Max price must be larger than min price');
    } else {
      fetchProjectItems();
      fetchWhitelistProjectItems();
    }
  }, [
    projectData,
    page,
    sort,
    searchToken,
    filterTraits,
    filterBuyNow,
    filterPrice,
    isWhitelistProject,
    filterRarity,
  ]);

  useAsyncEffect(async () => {
    if (projectData?.tokenID && projectData?.contractAddress) {
      const data = await projectMarketplaceData({
        projectId: String(projectData?.tokenID),
        contractAddress: String(projectData?.contractAddress),
      });
      setMarketplaceData(data);
    }
    setFilterTraits('');
  }, [projectData]);

  const isBitcoinProject = useMemo((): boolean => {
    if (!projectData) return false;
    if (isWhitelistProject) {
      return true;
    } else {
      return checkIsBitcoinProject(projectData.tokenID);
    }
  }, [projectData, isWhitelistProject]);

  const contextValues = useMemo((): IGenerativeProjectDetailContext => {
    return {
      projectData,
      projectFeeRate,
      debounceFetchProjectFeeRate,
      setProjectData,
      listItems,
      listItemsBuyable,
      setListItems,
      selectedOrders,
      removeSelectedOrder,
      addSelectedOrder,
      selectOrders,
      selectAllOrders,
      removeAllOrders,
      handleFetchNextPage,
      searchToken,
      setSearchToken,
      sort,
      setSort,
      total,
      filterBuyNow,
      setFilterBuyNow,
      isLoaded,
      setIsLoaded,
      isNextPageLoaded,
      showFilter,
      setShowFilter,
      filterTraits,
      setFilterTraits,
      page,
      setPage,
      filterPrice,
      setFilterPrice,
      filterRarity,
      setFilterRarity,
      isShowMintBTCModal,
      showMintBTCModal,
      hideMintBTCModal,
      isBitcoinProject,
      isWhitelistProject,
      isSatoshisPage,
      projectItemsTraitList,
      marketplaceData,
      setMarketplaceData,
      isLimitMinted,
      collectionActivities,
      setFilterActivities,
      isLayoutShop,
      setIsLayoutShop,
    };
  }, [
    projectData,
    setProjectData,
    listItems,
    listItemsBuyable,
    setListItems,
    selectedOrders,
    removeSelectedOrder,
    addSelectedOrder,
    selectOrders,
    selectAllOrders,
    removeAllOrders,
    handleFetchNextPage,
    searchToken,
    setSearchToken,
    sort,
    setSort,
    total,
    filterBuyNow,
    setFilterBuyNow,
    isLoaded,
    setIsLoaded,
    isNextPageLoaded,
    showFilter,
    setShowFilter,
    filterTraits,
    setFilterTraits,
    page,
    setPage,
    filterPrice,
    setFilterPrice,
    filterRarity,
    setFilterRarity,
    isShowMintBTCModal,
    showMintBTCModal,
    hideMintBTCModal,
    isBitcoinProject,
    isWhitelistProject,
    isSatoshisPage,
    projectItemsTraitList,
    marketplaceData,
    setMarketplaceData,
    isLimitMinted,
    collectionActivities,
    setFilterActivities,

    isLayoutShop,
    setIsLayoutShop,
  ]);

  return (
    <GenerativeProjectDetailContext.Provider value={contextValues}>
      {children}
    </GenerativeProjectDetailContext.Provider>
  );
};
