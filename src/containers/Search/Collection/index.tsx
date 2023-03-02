import React from 'react';
import Image from 'next/image';
import { Row, Col } from 'react-bootstrap';
import cn from 'classnames';

import Slider from '@components/Slider';

import s from './Collection.module.scss';

interface CollectionProps {
  className?: string;
}

const SLIDER_SETTING = {
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  arrows: true,
};

const COLLECTIONS = [
  {
    id: 0,
    imgUrl:
      'https://cdn.generative.xyz/upload/1677443626-b39s9u4kembdh8bis8qfkscjn6t0q4srvqjkia6ht7kuc80eu24vuttzsqptl4fji0_preview_(6).jpg',
    name: 'EndlessWorld',
    name2: 'FantasPoly',
    amount: '0.02 BTC',
    hasMin: '50/100 minted',
  },
  {
    id: 2,
    imgUrl: 'https://cdn.generative.xyz/upload/1676880061-thumbnails.jpg',
    name: 'EndlessWorld',
    name2: 'FantasPoly',
    amount: '0.02 BTC',
    hasMin: '50/100 minted',
  },
  {
    id: 3,
    imgUrl:
      'https://cdn.generative.xyz/upload/1676630151-1676496550-ab04689000dfdfde70035ad699c3212bd808d850d192b0f90fb8d77cced9713ei0.png',
    name: 'EndlessWorld',
    name2: 'FantasPoly',
    amount: '0.02 BTC',
    hasMin: '50/100 minted',
  },
  {
    id: 4,
    imgUrl: 'https://cdn.generative.xyz/upload/1676855420-compressed.gif',
    name: 'EndlessWorld',
    name2: 'FantasPoly',
    amount: '0.02 BTC',
    hasMin: '50/100 minted',
  },
  {
    id: 5,
    imgUrl: 'https://cdn.generative.xyz/upload/1677256927-angular.png',
    name: 'EndlessWorld',
    name2: 'FantasPoly',
    amount: '0.02 BTC',
    hasMin: '50/100 minted',
  },
];

const Collection = ({ className }: CollectionProps): JSX.Element => {
  return (
    <div className={cn(s.collection, className)}>
      <Row>
        <Col md={12}>
          <h6 className={s.collection_title}>Collection results</h6>
          <Slider settings={SLIDER_SETTING}>
            {COLLECTIONS.map(collection => (
              <div key={collection.id}>
                <div className={s.collection_item}>
                  <div className={s.collection_img}>
                    <Image
                      src={collection.imgUrl}
                      width={235}
                      height={368}
                      alt={collection.name}
                    />
                  </div>
                  <div className={s.collection_info}>
                    <div className={s.collection_info_name}>
                      {collection.name}
                    </div>
                    <div className={s.collection_info_aliasName}>
                      {collection.name2}
                    </div>
                    <div className={s.collection_info_payment}>
                      {collection.amount}
                      <span className={s.collection_info_dot}>•</span>
                      {collection.hasMin}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(Collection);
