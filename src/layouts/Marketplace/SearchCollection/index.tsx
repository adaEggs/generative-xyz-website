import Link from '@components/Link';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { LogLevel } from '@enums/log-level';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import { Project } from '@interfaces/project';
import { getProjectList } from '@services/project';
import log from '@utils/logger';
import cs from 'classnames';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import s from './styles.module.scss';

const LOG_PREFIX = 'SearchCollection';

const SearchCollection = () => {
  const [foundCollections, setFoundCollections] = useState<Project[]>();
  const [searchText, setSearchText] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const resultSearchRef = useRef<HTMLDivElement>(null);

  const handleSearchCollections = async () => {
    try {
      setIsLoading(true);
      const res = await getProjectList({
        contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
        limit: 20,
        page: 1,
        name: searchText,
      });
      if (res && res.result) {
        setFoundCollections(res.result);
      }
      setIsLoading(false);
    } catch (err: unknown) {
      log('failed to fetch collections', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const handleCloseSearchResult = () => {
    setShowResult(false);
    if (!searchText) {
      setExpandSearch(false);
    }
  };

  useEffect(() => {
    if (expandSearch) inputSearchRef.current?.focus();
  }, [expandSearch]);

  useEffect(() => {
    if (searchText) handleSearchCollections();
  }, [searchText]);

  useOnClickOutside(resultSearchRef, () => handleCloseSearchResult());

  return (
    <div className={s.wrapper}>
      <div className={cs(s.searchInput_wrapper, { [s.expand]: expandSearch })}>
        <input
          className={s.input}
          placeholder="Collection, artist, address…"
          onChange={debounce(e => {
            setSearchText(e.target.value);
            setShowResult(true);
          }, 300)}
          onFocus={() => setShowResult(true)}
          //   onBlur={handleCloseSearchResult}
          ref={inputSearchRef}
        ></input>
        <div
          className={s.searchIcon}
          onClick={() => setExpandSearch(!expandSearch)}
        >
          <SvgInset size={16} svgUrl={`${CDN_URL}/icons/ic-search-14x14.svg`} />
        </div>
      </div>
      {isLoading && (
        <div className={s.searchResult_wrapper}>
          <div className={s.searchResult_item_loading}>
            <Loading isLoaded={false} />
          </div>
        </div>
      )}
      {!isLoading && showResult && searchText && foundCollections && (
        <div className={s.searchResult_wrapper} ref={resultSearchRef}>
          {foundCollections.length === 0 ? (
            <div className={s.searchResult_item}>No Collection Found</div>
          ) : (
            <>
              {foundCollections.map(collection => (
                <SearchCollectionItem
                  key={`collection-${v4()}`}
                  projectName={collection.name}
                  creatorName={collection.creatorProfile?.displayName}
                  collectionId={collection.tokenID}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const SearchCollectionItem = ({
  projectName,
  creatorName,
  collectionId,
}: {
  projectName: string;
  creatorName?: string;
  collectionId?: string;
}) => {
  return (
    <Link
      className={cs(s.searchResult_item, s.searchResult_item_link)}
      href={`${ROUTE_PATH.GENERATIVE}/${collectionId}`}
    >
      <Text
        as="span"
        fontWeight="semibold"
        className={s.searchResult_collectionName}
      >
        {projectName}
      </Text>
      {creatorName && (
        <Text size="14" as="span" className={s.searchResult_creatorName}>
          by {creatorName}
        </Text>
      )}
    </Link>
  );
};

export default SearchCollection;
