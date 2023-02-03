import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { LogLevel } from '@enums/log-level';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { setProjectCurrent } from '@redux/project/action';
import { getProjectDetail, getProjectItems } from '@services/project';
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
import { useDispatch } from 'react-redux';

const LOG_PREFIX = 'GenerativeProjectDetailContext';

const FETCH_NUM = 20;

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
  query: Map<string, string> | null;
  setQuery: Dispatch<SetStateAction<Map<string, string> | null>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
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
  query: null,
  setQuery: _ => {
    return;
  },
  page: 1,
  setPage: _ => {
    return;
  },
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
  const [isNextPageLoaded, setIsNextPageLoaded] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterTraits, setFilterTraits] = useState('');
  const [query, setQuery] = useState<Map<string, string> | null>(null);

  const router = useRouter();
  const { projectID } = router.query as {
    projectID: string;
  };

  const handleFetchNextPage = () => {
    setPage(prev => prev + 1);
  };

  const fetchProjectDetail = async (): Promise<void> => {
    if (projectID) {
      try {
        const data = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID,
        });
        dispatch(setProjectCurrent(data));
        setProjectData(data);
      } catch (_: unknown) {
        log('failed to fetch project detail data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  const fetchProjectItems = async (): Promise<void> => {
    if (projectData?.genNFTAddr) {
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
    fetchProjectItems();
  }, [projectData, page, sort, searchToken, filterTraits, filterBuyNow]);

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
      query,
      setQuery,
      page,
      setPage,
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
    query,
    setQuery,
    page,
    setPage,
  ]);

  return (
    <GenerativeProjectDetailContext.Provider value={contextValues}>
      {children}
    </GenerativeProjectDetailContext.Provider>
  );
};
