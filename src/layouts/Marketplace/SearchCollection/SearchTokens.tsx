import cs from 'classnames';
import React from 'react';

import Link from '@components/Link';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import Image from 'next/image';
// import { formatLongAddress } from '@utils/format';
import { Token } from '@interfaces/token';

import s from './styles.module.scss';

const SearchTokenItem = ({
  thumbnail = '',
  tokenName,
  collectionId,
  tokenId,
  // inscriptionIndex,
  projectName,
  orderInscriptionIndex,
}: {
  tokenName: string;
  collectionId?: string;
  tokenId?: string;
  inscriptionIndex?: string;
  thumbnail?: string;
  projectName?: string;
  orderInscriptionIndex?: string;
}) => {
  return (
    <Link
      className={cs(s.searchResult_item, s.searchResult_item_link)}
      href={`${ROUTE_PATH.GENERATIVE}/${collectionId}/${tokenId}`}
    >
      <div className={s.searchResult_collectionThumbnail}>
        <Image src={thumbnail} alt={tokenName} width={34} height={34} />
      </div>
      <div className={s.searchResult_collectionInfo}>
        <Text as="span" className={s.searchResult_collectionName}>
          {`${projectName} #${orderInscriptionIndex}`}
        </Text>
      </div>
    </Link>
  );
};

const SearchTokensResult = ({ list }: { list: { tokenUri: Token }[] }) => {
  if (list.length === 0) return null;

  return (
    <>
      <div className={s.list_heading}>
        <Text size="12" fontWeight="medium" color="black-40-solid">
          ITEMS
        </Text>
      </div>
      {list.map(token => (
        <SearchTokenItem
          key={`token-${token.tokenUri.tokenID}`}
          thumbnail={token?.tokenUri?.image}
          tokenName={token?.tokenUri?.name}
          collectionId={token?.tokenUri?.project?.tokenID}
          tokenId={token?.tokenUri?.tokenID}
          inscriptionIndex={token?.tokenUri?.inscriptionIndex}
          projectName={token?.tokenUri?.project?.name}
          orderInscriptionIndex={token?.tokenUri?.orderInscriptionIndex}
        />
      ))}
    </>
  );
};

export default React.memo(SearchTokensResult);
