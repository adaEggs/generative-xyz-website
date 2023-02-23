import Avatar from '@components/Avatar';
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
import { User } from '@interfaces/user';
import { getProjectList } from '@services/project';
import { getUsers } from '@services/user';
import { formatLongAddress } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import s from './styles.module.scss';

const LOG_PREFIX = 'SearchCollection';

const SearchCollection = () => {
  const [foundCollections, setFoundCollections] = useState<Project[]>();
  const [searchText, setSearchText] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [expandSearch, setExpandSearch] = useState(false);
  const [foundUsers, setFoundUsers] = useState<User[]>();

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const resultSearchRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const [projects, members] = await Promise.all([
        getProjectList({
          contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
          limit: 5,
          page: 1,
          name: searchText,
        }),
        getUsers({
          limit: 5,
          page: 1,
          search: searchText,
        }),
      ]);

      if (projects && projects.result) {
        setFoundCollections(projects.result);
      }
      if (members && members.result) {
        setFoundUsers(members.result);
      }

      setIsLoading(false);
    } catch (err: unknown) {
      log('failed to fetch collections', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const handleCloseSearchResult = (): void => {
    setShowResult(false);
  };

  useEffect(() => {
    if (searchText && searchText.length > 2) {
      handleSearch();
    }
  }, [searchText]);

  useOnClickOutside(resultSearchRef, () => handleCloseSearchResult());

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <div className={cs(s.searchInput_wrapper)}>
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
        <div className={s.searchIcon}>
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
      {!isLoading && showResult && searchText && searchText.length > 2 && (
        <div className={s.searchResult_wrapper} ref={resultSearchRef}>
          {foundCollections && (
            <SearchCollectionsResult list={foundCollections} />
          )}
          {foundUsers && <SearchMembersResult list={foundUsers} />}
          {!foundCollections && !foundUsers && (
            <div className={s.searchResult_item}>No Result Found</div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchCollectionsResult = ({ list }: { list: Project[] }) => {
  if (list.length === 0) return null;

  return (
    <>
      <div className={s.list_heading}>
        <Text size="12" fontWeight="medium" color="black-40">
          COLLECTIONS
        </Text>
      </div>
      {list.map(collection => (
        <SearchCollectionItem
          key={`collection-${v4()}`}
          thumbnail={collection.image}
          projectName={collection.name}
          creatorName={
            collection.creatorProfile?.displayName ||
            formatLongAddress(collection.creatorProfile?.walletAddress)
          }
          collectionId={collection.tokenID}
        />
      ))}
    </>
  );
};

const SearchMembersResult = ({ list }: { list: User[] }) => {
  if (list.length === 0) return null;

  return (
    <>
      <div className={s.list_heading}>
        <Text size="12" fontWeight="medium" color="black-40">
          MEMBERS
        </Text>
      </div>
      {list.map(user => (
        <SearchMemberItem
          key={`member-${v4()}`}
          memberName={user.displayName || formatLongAddress(user.walletAddress)}
          avatar={user.avatar}
          memberId={user.walletAddress}
        />
      ))}
    </>
  );
};

const SearchCollectionItem = ({
  projectName,
  creatorName,
  collectionId,
  thumbnail = '',
}: {
  projectName: string;
  creatorName?: string;
  collectionId?: string;
  thumbnail?: string;
}) => {
  return (
    <Link
      className={cs(s.searchResult_item, s.searchResult_item_link)}
      href={`${ROUTE_PATH.GENERATIVE}/${collectionId}`}
    >
      <div className={s.searchResult_collectionThumbnail}>
        <Image src={thumbnail} alt={projectName} width={34} height={34} />
      </div>
      <div className={s.searchResult_collectionInfo}>
        <Text as="span" className={s.searchResult_collectionName}>
          {projectName}
        </Text>
        {creatorName && (
          <Text
            color="black-40"
            size="12"
            as="span"
            className={s.searchResult_creatorName}
          >
            by {creatorName}
          </Text>
        )}
      </div>
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
      <Avatar imgSrcs={avatar || ''} width={34} height={34} />
      <Text as="span" className={s.searchResult_collectionName}>
        {memberName}
      </Text>
    </Link>
  );
};

export default SearchCollection;
