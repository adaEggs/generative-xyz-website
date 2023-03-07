import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import React from 'react';
import Text from '@components/Text';
import s from './styles.module.scss';
import { Project } from '../../../interfaces/project';
import { formatLongAddress } from '../../../utils/format';

export const AuthenticCard = ({
  project,
}: {
  project: Project | null;
}): JSX.Element => {
  if (!project) return <></>;
  return (
    <div className={s.authenticCard}>
      <div className={s.authenticCard_inner}>
        <div className={s.authenticCard_thumb}>
          <Image
            width={88}
            height={147}
            src={`${CDN_URL}/images/eth-thumb.png`}
            alt={''}
          />
        </div>
        <div className={s.authenticCard_content}>
          <Text
            className={s.authenticCard_content_heading}
            size="20"
            fontWeight="medium"
          >
            Certificate of Authenticity
          </Text>

          {project?.tokenAddress && (
            <div className={s.authenticCard_content_property}>
              <div className="label">Original Collection</div>
              <div className="val">
                <a
                  href={`https://etherscan.io/address/${project?.tokenAddress}`}
                  target="_blank"
                >
                  {project.name}
                </a>
              </div>
            </div>
          )}
          {project?.nftTokenId && (
            <div className={s.authenticCard_content_property}>
              <div className="label">Original Token ID</div>
              <div className="val">
                <a
                  href={`https://etherscan.io/token/${project.nftTokenId}?a=${project.nftTokenId}`}
                  target="_blank"
                >
                  {project?.nftTokenId}
                </a>
              </div>
            </div>
          )}

          <div className={s.authenticCard_content_property}>
            <div className="label">Inscribed by</div>
            <div className="val">
              <a
                href={`https://etherscan.io/address/${project.creatorAddr}`}
                target="_blank"
              >
                {formatLongAddress(project.creatorAddr || '')}
              </a>
            </div>
          </div>
          {project?.ordinalsTx && (
            <div className={s.authenticCard_content_property}>
              <div className="label">Authenticity Hash</div>
              <div className="val">
                <a
                  href={`https://etherscan.io/tx/${project.ordinalsTx}`}
                  target="_blank"
                >
                  {formatLongAddress(project?.ordinalsTx)}
                </a>
              </div>
            </div>
          )}

          <div className={s.authenticCard_content_property}>
            <div className="label">Date</div>
            <div className="val">March 3, 2023</div>
          </div>
        </div>
      </div>
    </div>
  );
};
