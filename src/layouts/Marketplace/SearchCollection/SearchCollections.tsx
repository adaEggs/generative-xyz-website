import React, { useContext } from 'react';
import Image from 'next/image';
import cs from 'classnames';

import Link from '@components/Link';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { Project } from '@interfaces/project';
import { formatLongAddress } from '@utils/format';

import { QuickSearchContext } from './index';
import s from './styles.module.scss';

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
  const { onCloseSearchResult } = useContext(QuickSearchContext);

  return (
    <Link
      className={cs(s.searchResult_item, s.searchResult_item_link)}
      href={`${ROUTE_PATH.GENERATIVE}/${collectionId}`}
      onClick={onCloseSearchResult}
      isKeepDefaultEvent
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
            color="black-40-solid"
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

export const SearchCollectionsResult = ({
  list,
}: {
  list: { project: Project }[];
}) => {
  if (list.length === 0) return null;

  return (
    <>
      <div className={s.list_heading}>
        <Text size="12" fontWeight="medium" color="black-40-solid">
          COLLECTIONS
        </Text>
      </div>
      {list.map(collection => (
        <SearchCollectionItem
          key={`collection-${collection?.project?.tokenID}`}
          thumbnail={collection?.project?.image}
          projectName={collection?.project?.name}
          creatorName={
            collection?.project?.creatorProfile?.displayName ||
            formatLongAddress(
              collection?.project?.creatorProfile?.walletAddress
            )
          }
          collectionId={collection?.project?.tokenID}
        />
      ))}
    </>
  );
};

export default React.memo(SearchCollectionsResult);
