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
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '@interfaces/select-input';
import { getUsers } from '@services/user';
import { User } from '@interfaces/user';
import Avatar from '@components/Avatar';

const LOG_PREFIX = 'SearchCollection';

const SEARCH_OPTIONS = [
  {
    value: 'collections',
    label: 'Collections',
  },
  {
    value: 'members',
    label: 'Members',
  },
];

const SearchCollection = () => {
  const [foundResults, setFoundResults] = useState<Project[] | User[]>();
  const [searchText, setSearchText] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [searchOptions, setSearchOptions] = useState(SEARCH_OPTIONS[0].value);

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const resultSearchRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        setFoundResults(res.result);
      }
      setIsLoading(false);
    } catch (err: unknown) {
      log('failed to fetch collections', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const handleSearchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await getUsers({
        limit: 20,
        page: 1,
        search: searchText,
      });
      if (res && res.result) {
        setFoundResults(res.result);
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
    if (searchText && searchText.length > 2) {
      if (searchOptions === 'collections') handleSearchCollections();
      if (searchOptions === 'members') handleSearchMembers();
    }
    inputSearchRef.current?.focus();
  }, [searchText, searchOptions]);

  useOnClickOutside(resultSearchRef, () => handleCloseSearchResult());
  useOnClickOutside(wrapperRef, () => {
    if (!searchText) setExpandSearch(false);
  });

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <div className={cs(s.searchInput_wrapper, { [s.expand]: expandSearch })}>
        <div className={s.searchInput_options}>
          <div className={s.dropDownWrapper}>
            <Select
              isSearchable={false}
              isClearable={false}
              defaultValue={SEARCH_OPTIONS[0]}
              options={SEARCH_OPTIONS}
              className={cs(s.dropdownOptions)}
              classNamePrefix="select"
              onChange={(op: SingleValue<SelectOption>) => {
                if (op) setSearchOptions(op?.value);
              }}
            />
          </div>
        </div>
        <div className={s.h_divider}></div>
        <input
          className={s.input}
          placeholder="Collection, artist, address…"
          onChange={debounce(e => {
            setSearchText(e.target.value);
            setShowResult(true);
          }, 300)}
          onFocus={e => {
            setSearchText(e.target.value);
            setShowResult(true);
          }}
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
      {!isLoading &&
        showResult &&
        searchText &&
        searchText.length > 2 &&
        foundResults && (
          <div className={s.searchResult_wrapper} ref={resultSearchRef}>
            {searchOptions === 'collections' && (
              <SearchCollectionsResult list={foundResults as Project[]} />
            )}
            {searchOptions === 'members' && (
              <SearchMembersResult list={foundResults as User[]} />
            )}

            {/* {foundResults.length === 0 ? (
            <div className={s.searchResult_item}>No Collection Found</div>
          ) : (
            <>
              {foundResults.map(collection => (
                <SearchCollectionItem
                  key={`collection-${v4()}`}
                  projectName={collection.name}
                  creatorName={collection.creatorProfile?.displayName}
                  collectionId={collection.tokenID}
                />
              ))}
            </>
          )} */}
          </div>
        )}
    </div>
  );
};

const SearchCollectionsResult = ({ list }: { list: Project[] }) => {
  return (
    <>
      {list.length === 0 ? (
        <div className={s.searchResult_item}>No Collection Found</div>
      ) : (
        <>
          {list.map(collection => (
            <SearchCollectionItem
              key={`collection-${v4()}`}
              projectName={collection.name}
              creatorName={collection.creatorProfile?.displayName}
              collectionId={collection.tokenID}
            />
          ))}
        </>
      )}
    </>
  );
};

const SearchMembersResult = ({ list }: { list: User[] }) => {
  return (
    <>
      {list.length === 0 ? (
        <div className={s.searchResult_item}>No Member Found</div>
      ) : (
        <>
          {list.map(user => (
            <SearchMemberItem
              key={`member-${v4()}`}
              memberName={user.displayName || user.walletAddress}
              avatar={user.avatar}
              memberId={user.walletAddress}
            />
          ))}
        </>
      )}
    </>
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

const SearchMemberItem = ({
  memberName,
  avatar,
  memberId,
}: {
  memberName: string;
  avatar?: string;
  memberId: string;
}) => {
  return (
    <Link
      className={cs(
        s.searchResult_item,
        s.searchResult_item_link,
        s.searchResult_item_member
      )}
      href={`${ROUTE_PATH.PROFILE}/${memberId}`}
    >
      <Avatar imgSrcs={avatar || ''} width={20} height={20} />
      <Text
        as="span"
        fontWeight="semibold"
        className={s.searchResult_collectionName}
      >
        {memberName}
      </Text>
    </Link>
  );
};

export default SearchCollection;
