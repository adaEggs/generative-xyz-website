import s from './ProjectCard.module.scss';

import Heading from '@components/Heading';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import React from 'react';
import BigNumber from 'bignumber.js';
import NFTDisplayBox from '@components/NFTDisplayBox';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';

interface IPros {
  project: IGetMarketplaceBtcListItem;
  className?: string;
  index?: number;
}

export const ProjectCard = ({ project, className }: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();

  const convertBTCPrice = () => {
    return new BigNumber(project.price || 0).div(1e8).toString();
  };

  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        <div className={`${s.projectCard_thumb}`}>
          <NFTDisplayBox
            inscriptionID={project.inscriptionID}
            type={project.contentType}
            variants="absolute"
          />
        </div>
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  #{project.inscriptionNumber}
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
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>#{project.inscriptionNumber}</span>
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
