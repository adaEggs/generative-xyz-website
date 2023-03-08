import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import cs from 'classnames';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import s from './styles.module.scss';

// const LOG_PREFIX = 'SearchCollection';

// Do not remove commemt code, it will be used in the future
const SearchCollection = ({ theme = 'light' }: { theme: 'light' | 'dark' }) => {
  // const [foundCollections, setFoundCollections] = useState<Project[]>();
  const [searchText, setSearchText] = useState<string>('');
  // const [showResult, setShowResult] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  // const [expandSearch, setExpandSearch] = useState(false);
  // const [foundUsers, setFoundUsers] = useState<User[]>();
  // const [foundItems, setFoundItems] = useState<Token[]>();

  const inputSearchRef = useRef<HTMLInputElement>(null);
  // const resultSearchRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // const handleSearch = async () => {
  //   try {
  //     setIsLoading(true);
  //     const [projects, members, items] = await Promise.all([
  //       getProjectList({
  //         contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
  //         limit: 5,
  //         page: 1,
  //         name: searchText,
  //       }),
  //       getUsers({
  //         limit: 5,
  //         page: 1,
  //         search: searchText,
  //       }),
  //       getTokenUriList({
  //         limit: 5,
  //         page: 1,
  //         search: searchText,
  //       }),
  //     ]);

  //     if (projects && projects.result) {
  //       setFoundCollections(projects.result);
  //     }
  //     if (members && members.result) {
  //       setFoundUsers(members.result);
  //     }
  //     if (items && items.result) {
  //       setFoundItems(items.result);
  //     }

  //     setIsLoading(false);
  //   } catch (err: unknown) {
  //     log('failed to fetch collections', LogLevel.ERROR, LOG_PREFIX);
  //     throw Error();
  //   }
  // };

  // const handleCloseSearchResult = (): void => {
  //   setShowResult(false);
  //   setInputFocus(false);
  // };

  const goToSearchPage = (text: string): void => {
    router.push({
      pathname: ROUTE_PATH.SEARCH,
      query: { keyword: text?.trim() },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDownSearch = async (event: any): Promise<void> => {
    if (event?.key === 'Enter') {
      goToSearchPage(event?.target?.value);
    }
  };

  // useEffect(() => {
  //   if (searchText && searchText.length > 2) {
  //     handleSearch();
  //   }
  // }, [searchText]);

  // useOnClickOutside(resultSearchRef, () => handleCloseSearchResult());

  useOnClickOutside(wrapperRef, () => setInputFocus(false));

  return (
    <div
      className={cs(s.wrapper, s[theme], { [s.focus]: inputFocus })}
      ref={wrapperRef}
    >
      <div className={cs(s.searchInput_wrapper)}>
        <input
          className={s.input}
          placeholder="Collection, artist, address…"
          onChange={debounce(e => {
            setSearchText(e.target.value);
            // setShowResult(true);
          }, 300)}
          onFocus={e => {
            setSearchText(e.target.value);
            // setShowResult(true);
            setInputFocus(true);
          }}
          ref={inputSearchRef}
          onKeyDown={handleKeyDownSearch}
        />
        <div className={s.searchIcon}>
          {inputFocus ? (
            <SvgInset
              onClick={() => {
                goToSearchPage('');
                setSearchText('');
                if (inputSearchRef?.current) {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  inputSearchRef.current!.value = '';
                  inputSearchRef.current.focus();
                }
              }}
              size={16}
              svgUrl={`${CDN_URL}/icons/ic-close.svg`}
            />
          ) : (
            <SvgInset
              onClick={() => {
                goToSearchPage(searchText);
              }}
              size={16}
              svgUrl={`${CDN_URL}/icons/ic-search-14x14.svg`}
            />
          )}
        </div>
      </div>
      {/* {isLoading && (
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
          {foundItems && <SearchTokensResult list={foundItems} />}
          {foundCollections?.length === 0 &&
            foundUsers?.length === 0 &&
            foundItems?.length === 0 && (
              <div className={s.searchResult_item}>No Result Found</div>
            )}
        </div>
      )} */}
    </div>
  );
};

// const SearchCollectionsResult = ({ list }: { list: Project[] }) => {
//   if (list.length === 0) return null;

//   return (
//     <>
//       <div className={s.list_heading}>
//         <Text size="12" fontWeight="medium" color="black-40-solid">
//           COLLECTIONS
//         </Text>
//       </div>
//       {list.map(collection => (
//         <SearchCollectionItem
//           key={`collection-${v4()}`}
//           thumbnail={collection.image}
//           projectName={collection.name}
//           creatorName={
//             collection.creatorProfile?.displayName ||
//             formatLongAddress(collection.creatorProfile?.walletAddress)
//           }
//           collectionId={collection.tokenID}
//         />
//       ))}
//     </>
//   );
// };

// const SearchMembersResult = ({ list }: { list: User[] }) => {
//   if (list.length === 0) return null;

//   return (
//     <>
//       <div className={s.list_heading}>
//         <Text size="12" fontWeight="medium" color="black-40-solid">
//           MEMBERS
//         </Text>
//       </div>
//       {list.map(user => (
//         <SearchMemberItem
//           key={`member-${v4()}`}
//           memberName={user.displayName || formatLongAddress(user.walletAddress)}
//           avatar={user.avatar}
//           memberId={user.walletAddress}
//         />
//       ))}
//     </>
//   );
// };
// const SearchTokensResult = ({ list }: { list: Token[] }) => {
//   if (list.length === 0) return null;

//   return (
//     <>
//       <div className={s.list_heading}>
//         <Text size="12" fontWeight="medium" color="black-40-solid">
//           ITEMS
//         </Text>
//       </div>
//       {list.map(token => (
//         <SearchTokenItem
//           key={`token-${v4()}`}
//           thumbnail={token.image}
//           tokenName={token.name}
//           collectionId={token.projectID}
//           tokenId={token.tokenID}
//           inscriptionIndex={token.inscriptionIndex}
//           projectName={token.projectName}
//         />
//       ))}
//     </>
//   );
// };

// const SearchCollectionItem = ({
//   projectName,
//   creatorName,
//   collectionId,
//   thumbnail = '',
// }: {
//   projectName: string;
//   creatorName?: string;
//   collectionId?: string;
//   thumbnail?: string;
// }) => {
//   return (
//     <Link
//       className={cs(s.searchResult_item, s.searchResult_item_link)}
//       href={`${ROUTE_PATH.GENERATIVE}/${collectionId}`}
//     >
//       <div className={s.searchResult_collectionThumbnail}>
//         <Image src={thumbnail} alt={projectName} width={34} height={34} />
//       </div>
//       <div className={s.searchResult_collectionInfo}>
//         <Text as="span" className={s.searchResult_collectionName}>
//           {projectName}
//         </Text>
//         {creatorName && (
//           <Text
//             color="black-40-solid"
//             size="12"
//             as="span"
//             className={s.searchResult_creatorName}
//           >
//             by {creatorName}
//           </Text>
//         )}
//       </div>
//     </Link>
//   );
// };

// const SearchTokenItem = ({
//   thumbnail = '',
//   tokenName,
//   collectionId,
//   tokenId,
//   inscriptionIndex,
//   projectName,
// }: {
//   tokenName: string;
//   collectionId?: string;
//   tokenId?: string;
//   inscriptionIndex?: string;
//   thumbnail?: string;
//   projectName?: string;
// }) => {
//   return (
//     <Link
//       className={cs(s.searchResult_item, s.searchResult_item_link)}
//       href={`${ROUTE_PATH.GENERATIVE}/${collectionId}/${tokenId}`}
//     >
//       <div className={s.searchResult_collectionThumbnail}>
//         <Image src={thumbnail} alt={tokenName} width={34} height={34} />
//       </div>
//       <div className={s.searchResult_collectionInfo}>
//         <Text as="span" className={s.searchResult_collectionName}>
//           {inscriptionIndex
//             ? `${projectName} #${inscriptionIndex}`
//             : `${projectName} #${formatLongAddress(tokenId)}`}
//         </Text>
//       </div>
//     </Link>
//   );
// };

// const SearchMemberItem = ({
//   memberName,
//   avatar,
//   memberId,
// }: {
//   memberName: string;
//   avatar?: string;
//   memberId: string;
// }) => {
//   return (
//     <Link
//       className={cs(
//         s.searchResult_item,
//         s.searchResult_item_link,
//         s.searchResult_item_member
//       )}
//       href={`${ROUTE_PATH.PROFILE}/${memberId}`}
//     >
//       <Avatar imgSrcs={avatar || ''} width={34} height={34} />
//       <Text as="span" className={s.searchResult_collectionName}>
//         {memberName}
//       </Text>
//     </Link>
//   );
// };

export default SearchCollection;
