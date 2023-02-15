import s from './ProjectCard.module.scss';

import Heading from '@components/Heading';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import { IGetMarketplaceBtcListItem } from '@services/marketplace-btc';
import { convertIpfsToHttp } from '@utils/image';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import React, { useState } from 'react';
import BigNumber from 'bignumber.js';

interface IPros {
  project: IGetMarketplaceBtcListItem;
  className?: string;
}

export const ProjectCard = ({ project, className }: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();
  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const getImgURL = () => {
    if (!project?.inscriptionID) return '';
    return `https://ordinals-explorer.generative.xyz/preview/${project?.inscriptionID}`;
  };

  const [thumb, setThumb] = useState<string>(getImgURL());

  const convertBTCPrice = () => {
    return new BigNumber(project.price || 0).div(1e8).toString();
  };

  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        <div className={`${s.projectCard_thumb}`}>
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
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              {/* {creator && (
                <Text size="11" fontWeight="medium">
                  {creator.displayName || formatAddress(creator.walletAddress)}
                </Text>
              )} */}
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  #{project.index}
                </Text>
                {(project?.price || 0) > 0 && (
                  <Text size="12" fontWeight="semibold">
                    {convertBTCPrice()}&nbsp;BTC
                  </Text>
                )}
              </div>
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              {/* {creator && <CreatorInfo creator={creatorMemo} />} */}
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>#{project.index}</span>
                </Heading>
                {(project?.price || 0) > 0 && (
                  <Heading as={'h4'} className={s.projectCard_info_price}>
                    {convertBTCPrice()}&nbsp;BTC
                  </Heading>
                )}
              </div>
              {project?.buyable && (
                <div className={cs(s.btnBuyNow)}>Buy Now </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Link
        href={`${ROUTE_PATH.TRADE}/${project.inscriptionID}`}
        className={s.mask}
      />
    </div>
  );
};
