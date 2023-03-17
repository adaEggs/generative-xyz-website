import s from './ProjectCard.module.scss';

import Heading from '@components/Heading';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import React from 'react';
import NFTDisplayBox from '@components/NFTDisplayBox';
import { formatBTCPrice, formatLongAddress } from '@utils/format';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
import usePurchaseStatus from '@hooks/usePurchaseStatus';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';

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
  const { isBuyBTC, isBuyETH } = usePurchaseStatus({
    buyable: project.buyable,
    priceBTC: project.priceBtc,
    priceETH: project.priceEth,
    orderID: project.orderID,
    isVerified: project.sellVerified,
  });
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
                {(Number(project?.price) || 0) > 0 && (
                  <Text size="12" fontWeight="semibold">
                    {formatBTCPrice(project.price || 0)}&nbsp;BTC
                  </Text>
                )}
                <Text
                  size="14"
                  fontWeight="medium"
                  className={s.projectCard_info_wrapper_displayName}
                >
                  {project?.holder?.displayName ||
                    formatLongAddress(project?.address as string)}
                </Text>
              </div>
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              <div
                className={cs(
                  s.projectCard_info_title,
                  s.projectCard_info_wrapper
                )}
              >
                <Heading as={'h4'}>
                  <span title={project.name}>#{project.inscriptionNumber}</span>
                </Heading>
                <Text
                  size="20"
                  fontWeight="medium"
                  className={s.projectCard_info_wrapper_displayName}
                >
                  {project?.holder?.displayName ||
                    formatLongAddress(project?.address as string)}
                </Text>
                {(Number(project?.price) || 0) > 0 && (
                  <Heading as={'h4'} className={s.projectCard_info_price}>
                    {formatBTCPrice(project.price || 0)}&nbsp;BTC
                  </Heading>
                )}
              </div>
              {isBuyBTC && (
                <ButtonBuyListedFromBTC
                  inscriptionID={project.inscriptionID}
                  price={Number(project.priceBtc || 0)}
                  inscriptionNumber={Number(project.inscriptionNumber || 0)}
                  orderID={project.orderID}
                />
              )}
              {isBuyETH && (
                <ButtonBuyListedFromETH
                  inscriptionID={project.inscriptionID}
                  price={Number(project.priceEth || 0)}
                  inscriptionNumber={Number(project.inscriptionNumber || 0)}
                  orderID={project.orderID}
                />
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
