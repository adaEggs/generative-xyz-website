import s from './ProjectCard.module.scss';

import Heading from '@components/Heading';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import React from 'react';
import NFTDisplayBox from '@components/NFTDisplayBox';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
import { formatBTCPrice, formatEthPrice } from '@utils/format';

interface IPros {
  project: IGetMarketplaceBtcListItem;
  className?: string;
  index?: number;
}

export const ProjectCard = ({ project, className }: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();

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
                <div className={s.projectCard_info_price}>
                  {(Number(project?.price) || 0) > 0 && (
                    <Text size="12" fontWeight="semibold">
                      {formatBTCPrice(project?.price)}&nbsp;BTC{' '}
                      {project.paymentListingInfo &&
                        project.paymentListingInfo.eth &&
                        project.paymentListingInfo.eth.price &&
                        `| ${formatEthPrice(
                          project.paymentListingInfo.eth.price
                        )} ETH`}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>#{project.inscriptionNumber}</span>
                </Heading>
                <div className={s.projectCard_info_price}>
                  {(Number(project?.price) || 0) > 0 && (
                    <Heading as={'h4'} className={s.projectCard_info_price}>
                      {formatBTCPrice(project?.price)}&nbsp;BTC{' '}
                      {project.paymentListingInfo &&
                        project.paymentListingInfo.eth &&
                        project.paymentListingInfo.eth.price &&
                        (Number(project.paymentListingInfo.eth.price) || 0) >
                          0 &&
                        `| ${formatEthPrice(
                          project.paymentListingInfo.eth.price
                        )} ETH`}
                    </Heading>
                  )}
                </div>
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
