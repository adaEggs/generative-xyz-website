import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import React, { useMemo } from 'react';
import Text from '@components/Text';
import s from './styles.module.scss';
import { Project } from '../../../interfaces/project';
import { formatLongAddress } from '../../../utils/format';
import { ROUTE_PATH } from '@constants/route-path';
import Link from 'next/link';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import dayjs from 'dayjs';
import { wordCase } from '@utils/common';

export const AuthenticCard = ({
  project,
  nftTokenId,
}: {
  project: Project | null;
  nftTokenId?: string;
}): JSX.Element => {
  const dateMinted = useMemo((): string => {
    return project && project.mintedTime
      ? dayjs(project.mintedTime).format('MMM DD, YYYY')
      : '';
  }, [project]);
  if (!project) return <></>;
  return (
    <div className={s.authenticCard}>
      <div className={s.authenticCard_inner}>
        <div className={s.authenticCard_thumb}>
          <Image
            width={88}
            height={147}
            src={`${CDN_URL}/images/Layer_x0020_1.png`}
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
                  {wordCase(project.name)}
                </a>
              </div>
            </div>
          )}
          {nftTokenId && (
            <div className={s.authenticCard_content_property}>
              <div className="label">Original Token ID</div>
              <div className="val">
                <a
                  href={`https://etherscan.io/token/${project.tokenAddress}?a=${nftTokenId}`}
                  target="_blank"
                >
                  {nftTokenId}
                </a>
              </div>
            </div>
          )}

          {project.inscribedBy && (
            <div className={s.authenticCard_content_property}>
              <div className="label">
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 0, hide: 100 }}
                  overlay={
                    <Tooltip id="btc-fee-tooltip">
                      <Text size="14" fontWeight="semibold" color="primary-333">
                        This item was inscribed by the owner of the Ethereum NFT
                        at the time of inscription.
                      </Text>
                    </Tooltip>
                  }
                >
                  <div className="label_inner">
                    {' '}
                    Inscribed by <span className={s.question}>?</span>{' '}
                  </div>
                </OverlayTrigger>
              </div>
              <div className="val">
                <a
                  href={`https://opensea.io/${project.inscribedBy}`}
                  target="_blank"
                >
                  {formatLongAddress(project.inscribedBy || '')}
                </a>
              </div>
            </div>
          )}

          {project?.ordinalsTx && (
            <div className={s.authenticCard_content_property}>
              <div className="label">
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 0, hide: 100 }}
                  overlay={
                    <Tooltip id="btc-fee-tooltip">
                      <Text size="14" fontWeight="semibold" color="primary-333">
                        This is the authenticity link between the Ethereum NFT
                        and the Bitcoin inscription stored in a smart contract.
                      </Text>
                    </Tooltip>
                  }
                >
                  <div className="label_inner">
                    Authenticity Hash <span className={s.question}>?</span>{' '}
                  </div>
                </OverlayTrigger>
              </div>
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
            <div className="val">{dateMinted}</div>
          </div>
          <p className={s.more}>
            <Link href={ROUTE_PATH.AUTHENTIC_INSCRIPTIONS}>
              <ButtonIcon
                sizes={'small'}
                endIcon={
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                  />
                }
              >
                Inscribe your Ethereum NFTs now
              </ButtonIcon>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
