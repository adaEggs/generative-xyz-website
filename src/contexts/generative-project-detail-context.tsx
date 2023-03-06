import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { SATOSHIS_PROJECT_ID } from '@constants/generative';
import { ROUTE_PATH } from '@constants/route-path';
import { LogLevel } from '@enums/log-level';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { setProjectCurrent } from '@redux/project/action';
import { getProjectDetail, getProjectItems } from '@services/project';
import { checkIsBitcoinProject } from '@utils/generative';
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
import { useDispatch } from 'react-redux';

const LOG_PREFIX = 'GenerativeProjectDetailContext';

// const FETCH_NUM = 20;
const FETCH_NUM = 2000; // TODO: HOT FIX LIMIT

export interface IGenerativeProjectDetailContext {
  projectData: Project | null;
  setProjectData: Dispatch<SetStateAction<Project | null>>;
  listItems: Token[] | null;
  setListItems: Dispatch<SetStateAction<Token[] | null>>;
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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  filterPrice: {
    from_price: string;
    to_price: string;
  };
  setFilterPrice: Dispatch<
    React.SetStateAction<{
      from_price: string;
      to_price: string;
    }>
  >;
  isShowMintBTCModal: boolean;
  showMintBTCModal: () => void;
  hideMintBTCModal: () => void;
  isBitcoinProject: boolean;
  isWhitelistProject: boolean;
  isSatoshisPage: boolean;
}

const initialValue: IGenerativeProjectDetailContext = {
  projectData: null,
  setProjectData: _ => {
    return;
  },
  listItems: null,
  setListItems: _ => {
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
    from_price: '',
    to_price: '',
  },
  setFilterPrice: _ => {
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
};

export const GenerativeProjectDetailContext =
  createContext<IGenerativeProjectDetailContext>(initialValue);

export const GenerativeProjectDetailProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const dispatch = useDispatch();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [listItems, setListItems] = useState<Token[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [filterBuyNow, setFilterBuyNow] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isShowMintBTCModal, setIsShowMintBTCModal] = useState<boolean>(false);
  const [isNextPageLoaded, setIsNextPageLoaded] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterTraits, setFilterTraits] = useState('');
  const [filterPrice, setFilterPrice] = useState({
    from_price: '',
    to_price: '',
  });
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

  const fetchProjectDetail = async (): Promise<void> => {
    if (projectID || isSatoshisPage) {
      try {
        const data = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID: isSatoshisPage ? SATOSHIS_PROJECT_ID : projectID,
        });
        dispatch(setProjectCurrent(data));
        setProjectData(data);
      } catch (_: unknown) {
        log('failed to fetch project detail data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  const fetchProjectItems = async (): Promise<void> => {
    if (projectData?.genNFTAddr && !isWhitelistProject) {
      try {
        if (page > 1) {
          setIsNextPageLoaded(false);
        } else {
          setIsLoaded(false);
        }

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
            has_price: filterBuyNow || '',
            from_price: filterPrice.from_price || '',
            to_price: filterPrice.to_price || '',
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
            from_price: filterPrice.from_price || '',
            to_price: filterPrice.to_price || '',
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

  useEffect(() => {
    fetchProjectDetail();
  }, [projectID]);

  useEffect(() => {
    if (filterPrice.to_price && filterPrice.to_price < filterPrice.from_price) {
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
  ]);

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
      setProjectData,
      listItems,
      setListItems,
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
      isShowMintBTCModal,
      showMintBTCModal,
      hideMintBTCModal,
      isBitcoinProject,
      isWhitelistProject,
      isSatoshisPage,
    };
  }, [
    projectData,
    setProjectData,
    listItems,
    setListItems,
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
    isShowMintBTCModal,
    showMintBTCModal,
    hideMintBTCModal,
    isBitcoinProject,
    isWhitelistProject,
    isSatoshisPage,
  ]);

  return (
    <GenerativeProjectDetailContext.Provider value={contextValues}>
      {children}
    </GenerativeProjectDetailContext.Provider>
  );
};
