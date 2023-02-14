import s from './Card.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import { IGetCollectionBtcListItem } from '@services/marketplace-btc';
import { convertIpfsToHttp } from '@utils/image';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import React, { useState } from 'react';
import cs from 'classnames';
import Heading from '@components/Heading';

interface IPros {
  project: IGetCollectionBtcListItem;
  className?: string;
}

const Card = ({ project, className }: IPros): JSX.Element => {
  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const getImgURL = () => {
    if (!project?.inscriptionID) return '';
    return `https://ordinals.com/preview/${project?.inscriptionID}`;
  };

  const [thumb, setThumb] = useState<string>(getImgURL());

  return (
    <div className={`${s.collectionCard} ${className}`}>
      <div className={s.collectionCard_inner}>
        <div className={`${s.collectionCard_thumb}`}>
          {thumb !== LOGO_MARKETPLACE_URL ? (
            <iframe
              sandbox="allow-scripts"
              scrolling="no"
              loading="lazy"
              src={thumb}
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                position: 'absolute',
              }}
            />
          ) : (
            <img
              onError={onThumbError}
              src={convertIpfsToHttp(thumb)}
              alt={project.inscriptionID}
              loading={'lazy'}
            />
          )}
        </div>
        <div className={cs(s.projectCard_info, s.desktop)}>
          {/* {creator && <CreatorInfo creator={creatorMemo} />} */}
          <div className={s.projectCard_info_title}>
            <Heading as={'h4'}>
              <span title={project.name}>{project.name}</span>
            </Heading>
          </div>
          <div className={cs(s.btnBuyNow)}>Buy Now</div>
        </div>
      </div>
      <Link
        href={`${ROUTE_PATH.TRADE}/${project.inscriptionID}`}
        className={s.mask}
      />
    </div>
  );
};

export default Card;
