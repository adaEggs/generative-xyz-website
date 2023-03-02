import React from 'react';
import Image from 'next/image';
import { Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import { IProjectItem } from '@interfaces/api/search';
import { getSearchByKeyword, getApiKey } from '@services/search';
import { ROUTE_PATH } from '@constants/route-path';
import Slider from '@components/Slider';
import Link from '@components/Link';

import s from './Collection.module.scss';
import { PAYLOAD_DEFAULT, OBJECT_TYPE } from '../constant';

interface CollectionProps {
  className?: string;
}

export const CollectionItem = ({
  tokenId,
  image,
  name,
  creatorAddr,
  mintPrice,
  index,
  maxSupply,
}: IProjectItem): JSX.Element => {
  return (
    <Link href={`${ROUTE_PATH.GENERATIVE}/${tokenId}`}>
      <div className={s.collection_item}>
        <div className={s.collection_img}>
          <Image src={image} width={235} height={368} alt={name} />
        </div>
        <div className={s.collection_info}>
          <div className={s.collection_info_name}>{creatorAddr}</div>
          <div className={s.collection_info_aliasName}>{name}</div>
          <div className={s.collection_info_payment}>
            {mintPrice}&nbsp;BTC
            <span className={s.collection_info_dot}>•</span>
            {index}/{maxSupply}&nbsp;minted
          </div>
        </div>
      </div>
    </Link>
  );
};

const Collection = ({ className }: CollectionProps): JSX.Element => {
  const router = useRouter();

  const { keyword = '' } = router.query;
  const filterParams = {
    ...PAYLOAD_DEFAULT,
    keyword,
    type: OBJECT_TYPE.PROJECT,
  };
  const { data } = useSWR(
    getApiKey(getSearchByKeyword, filterParams),
    getSearchByKeyword
  );
  const collections = data?.result || [];

  if (collections?.length < 1) return <></>;

  const SLIDER_SETTING = {
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: collections.length > 4,
    dots: true,
    arrows: true,
  };

  return (
    <div className={cn(s.collection, className)}>
      <Row>
        <h6 className={s.collection_title}>Collection results</h6>
        {collections.length <= 4 ? (
          <Row>
            {collections.map(collection => (
              <Col key={collection?.project?.objectId} md={3}>
                <CollectionItem {...collection?.project} />
              </Col>
            ))}
          </Row>
        ) : (
          <Col md={12}>
            <Slider settings={SLIDER_SETTING}>
              {collections.map(collection => (
                <div key={collection?.project?.objectId}>
                  <CollectionItem {...collection?.project} />
                </div>
              ))}
            </Slider>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default React.memo(Collection);
