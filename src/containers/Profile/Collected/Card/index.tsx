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
    project.status === CollectedNFTStatus.Success
      ? project.projectID
        ? `${ROUTE_PATH.GENERATIVE}/${project.projectID}/${project.inscriptionID}`
        : `${ROUTE_PATH.LIVE}/${project.inscriptionID}`
      : `${ROUTE_PATH.GENERATIVE}/${project.projectID}`;

  const projectName =
    project.status === CollectedNFTStatus.Success
      ? `#${project.inscriptionNumber}`
      : project.projectName || '';

  const isNotShowBlur =
    project.status === CollectedNFTStatus.Success ||
    project.statusText === 'Minted' ||
    project.statusText === 'Transferring';

  return (
    <Link href={linkPath} className={`${s.projectCard} ${className}`}>
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
            {!isNotShowBlur && <div className={s.projectCard_thumb_backdrop} />}
          </div>
        ) : (
          <div className={`${s.projectCard_thumb}`}>
            <div className={s.projectCard_thumb_inner}>
              <NFTDisplayBox
                inscriptionID={project.inscriptionID}
                type={project.contentType}
                variants="absolute"
              />
            </div>
            {!isNotShowBlur && <div className={s.projectCard_thumb_backdrop} />}
          </div>
        )}
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              {project.status !== CollectedNFTStatus.Success && (
                <div className={s.projectCard_creator}>
                  <Text
                    className={s.projectCard_creator_status}
                    size={'16'}
                    fontWeight="medium"
                    color="black-40"
                  >
                    {`${project.statusText}...`}
                  </Text>
                </div>
              )}
              {projectName && (
                <Text size="11" fontWeight="medium">
                  {projectName}
                </Text>
              )}
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              {project.status !== CollectedNFTStatus.Success && (
                <div className={s.projectCard_creator}>
                  <Text
                    className={s.projectCard_creator_status}
                    size={'16'}
                    fontWeight="medium"
                    color="black-40"
                  >
                    {`${project.statusText}...`}
                  </Text>
                </div>
              )}
              {projectName && (
                <div className={s.projectCard_creator}>
                  <Text size={'20'} fontWeight="medium">
                    {projectName}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={s.mask} />
    </Link>
  );
};
