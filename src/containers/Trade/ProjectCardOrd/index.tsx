import s from './ProjectCard.module.scss';

import Heading from '@components/Heading';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import { IGetMarketplaceBtcListItem } from '@services/marketplace-btc';
import React from 'react';
import NFTDisplayBox from '@components/NFTDisplayBox';
import { formatBTCPrice } from '@utils/format';

interface IPros {
  project: IGetMarketplaceBtcListItem;
  className?: string;
  index?: number;
}

export const ProjectCardOrd = ({
  project,
  className,
  index = 0,
}: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();
  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        <div
          className={`${s.projectCard_thumb}`}
          style={{ paddingBottom: index % 2 === 0 ? '120%' : '100%' }}
        >
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
                    {formatBTCPrice(project.price || 0)}&nbsp;BTC
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
                    {formatBTCPrice(project.price || 0)}&nbsp;BTC
                  </Heading>
                )}
              </div>
              {project?.buyable && (
                <div className={cs(s.btnBuyNow)}>Buy Now</div>
              )}
            </div>
          )}
        </div>
      </div>
      <Link
        href={`${ROUTE_PATH.LIVE}/${project.inscriptionID}`}
        className={s.mask}
      />
    </div>
  );
};
