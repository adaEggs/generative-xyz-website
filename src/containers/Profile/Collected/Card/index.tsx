import Heading from '@components/Heading';
import Link from '@components/Link';
import NFTDisplayBox from '@components/NFTDisplayBox';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import useWindowSize from '@hooks/useWindowSize';
import { CollectedNFTStatus, ICollectedNFTItem } from '@interfaces/api/profile';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import React, { useState } from 'react';
import s from './CollectedCard.module.scss';

interface IPros {
  project: ICollectedNFTItem;
  className?: string;
  index?: number;
}

export const CollectedCard = ({ project, className }: IPros): JSX.Element => {
  const { mobileScreen } = useWindowSize();

  const [thumb, setThumb] = useState<string>(project.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const linkPath =
    project.status === CollectedNFTStatus.minting
      ? `${ROUTE_PATH.GENERATIVE}/${project.projectID}`
      : `${ROUTE_PATH.TRADE}/${project.inscriptionID}`;

  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        {project.image ? (
          <div
            className={`${s.projectCard_thumb} ${
              thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
            }`}
          >
            <div className={s.projectCard_thumb_inner}>
              <img
                onError={onThumbError}
                src={convertIpfsToHttp(thumb)}
                alt={project.name}
                loading={'lazy'}
              />
            </div>
          </div>
        ) : (
          <div className={`${s.projectCard_thumb}`}>
            <NFTDisplayBox
              inscriptionID={project.inscriptionID}
              type={project.contentType}
              variants="absolute"
            />
          </div>
        )}
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  {project.status === CollectedNFTStatus.success
                    ? `#${project.inscriptionNumber}`
                    : project.projectName || ''}
                </Text>
              </div>
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>
                    {project.status === CollectedNFTStatus.success
                      ? `#${project.inscriptionNumber}`
                      : project.projectName || ''}
                  </span>
                </Heading>
              </div>
            </div>
          )}
        </div>
        {project.status === CollectedNFTStatus.minting && (
          <div className={s.projectCard_info_title}>
            <Text size={'16'} fontWeight="medium" color="black-40">
              Minting
            </Text>
          </div>
        )}
      </div>
      <Link href={linkPath} className={s.mask} />
    </div>
  );
};
