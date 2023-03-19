import { useEffect, useRef, useState, useReducer, createContext } from 'react';
import cs from 'classnames';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';

import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import { getSearchByKeyword } from '@services/search';
import { OBJECT_TYPE } from '@containers/Search/constant';
import { getApiKey } from '@utils/swr';

import SearchCollectionsResult from './SearchCollections';
import SearchMembersResult from './SearchMembers';
import SearchTokensResult from './SearchTokens';

import s from './styles.module.scss';

const CACHE_API = new Map();

export const QuickSearchContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCloseSearchResult: () => {},
});

const SearchCollection = ({ theme = 'light' }: { theme: 'light' | 'dark' }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const [searchResults, setSearchResults] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any, partialData: any) => ({
      ...data,
      ...partialData,
    }),
    {
      projects: [],
      tokens: [],
      users: [],
    }
  );

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const resultSearchRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleSearch = async () => {
    setIsLoading(true);
    const filterParams = {
      page: 1,
      limit: 5,
      keyword: searchText,
    };
    const filterCollectionParams = {
      ...filterParams,
      type: OBJECT_TYPE.PROJECT,
    };
    const filterArtistParams = {
      ...filterParams,
      type: OBJECT_TYPE.ARTIST,
    };
    const filterTokenParams = {
      ...filterParams,
      type: OBJECT_TYPE.TOKEN,
    };

    const keyCollections = getApiKey(
      getSearchByKeyword,
      filterCollectionParams
    );
    const keyTokens = getApiKey(getSearchByKeyword, filterTokenParams);
    const keyArtist = getApiKey(getSearchByKeyword, filterArtistParams);

    const [projects, tokens, users] = await Promise.all([
      CACHE_API.has(keyCollections)
        ? CACHE_API.get(keyCollections)
        : getSearchByKeyword(filterCollectionParams),
      CACHE_API.has(keyTokens)
        ? CACHE_API.get(keyTokens)
        : getSearchByKeyword(filterTokenParams),
      CACHE_API.has(keyArtist)
        ? CACHE_API.get(keyArtist)
        : getSearchByKeyword(filterArtistParams),
    ]);

    CACHE_API.set(keyCollections, projects || {});
    CACHE_API.set(keyTokens, tokens || {});
    CACHE_API.set(keyArtist, users || {});

    setSearchResults({
      projects: projects?.result || [],
      tokens: tokens?.result || [],
      users: users?.result || [],
    });

    setIsLoading(false);
  };

  const handleCloseSearchResult = (): void => {
    setShowResult(false);
    setInputFocus(false);
  };

  const goToSearchPage = (text: string): void => {
    router.push({
      pathname: ROUTE_PATH.SEARCH,
      query: { keyword: text?.trim() },
    });
  };

  const handleKeyDownSearch = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event?.key === 'Enter') {
      goToSearchPage((event?.target as HTMLInputElement)?.value);
      handleCloseSearchResult();
    }
  };

  useEffect(() => {
    if (searchText?.length > 2) {
      handleSearch();
    }
  }, [searchText]);

  useOnClickOutside(resultSearchRef, () => handleCloseSearchResult());
  useOnClickOutside(wrapperRef, () => setInputFocus(false));

  return (
    <div
      className={cs(s.wrapper, s[theme], { [s.focus]: inputFocus })}
      ref={wrapperRef}
    >
      <div className={cs(s.searchInput_wrapper)}>
        <input
          className={s.input}
          onChange={debounce(e => {
            setSearchText(e.target.value);
            setShowResult(true);
            setInputFocus(true);
          }, 300)}
          onFocus={() => {
            setShowResult(true);
            setInputFocus(true);
          }}
          ref={inputSearchRef}
          onKeyDown={handleKeyDownSearch}
          placeholder="Collection, artist, address…"
          type="text"
        />
        <div className={s.searchIcon}>
          <SvgInset
            onClick={() => {
              goToSearchPage(searchText);
            }}
            size={16}
            svgUrl={`${CDN_URL}/icons/ic-search-14x14.svg`}
          />
        </div>
      </div>
      {isLoading && (
        <div className={s.searchResult_wrapper}>
          <div className={s.searchResult_item_loading}>
            <Loading isLoaded={false} />
          </div>
        </div>
      )}
      {!isLoading && showResult && searchText?.length > 2 && (
        <div className={s.searchResult_wrapper} ref={resultSearchRef}>
          <QuickSearchContext.Provider
            value={{
              onCloseSearchResult: handleCloseSearchResult,
            }}
          >
            {searchResults?.projects?.length > 0 && (
              <SearchCollectionsResult list={searchResults?.projects} />
            )}
            {searchResults?.users?.length > 0 && (
              <SearchMembersResult list={searchResults?.users} />
            )}
            {searchResults?.tokens?.length > 0 && (
              <SearchTokensResult list={searchResults?.tokens} />
            )}
            {searchResults?.projects?.length === 0 &&
              searchResults?.users?.length === 0 &&
              searchResults?.tokens?.length === 0 && (
                <div className={s.searchResult_item}>No Result Found</div>
              )}
          </QuickSearchContext.Provider>
        </div>
      )}
    </div>
  );
};

export default SearchCollection;
