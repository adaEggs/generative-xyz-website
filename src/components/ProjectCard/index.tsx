import React, { useEffect, useMemo, useRef, useState } from 'react';

import s from './ProjectCard.module.scss';
import Heading from '@components/Heading';
import Link from '@components/Link';
import MintingProgressBar from '@components/MintingProgressBar';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import useWindowSize from '@hooks/useWindowSize';
import { Project } from '@interfaces/project';
import { User } from '@interfaces/user';
import {
  formatAddress,
  formatBTCPrice,
  formatLongAddress,
} from '@utils/format';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';
import ButtonIcon from '@components/ButtonIcon';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';

interface IPros {
  project: Project;
  className?: string;
}

export const ProjectCard = ({ project, className }: IPros): JSX.Element => {
  const [creator, setCreator] = useState<User | null>(null);
  const { mobileScreen } = useWindowSize();
  const [thumb, setThumb] = useState<string>(project.image);
  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (project.creatorProfile) {
      setCreator(project.creatorProfile);
    }
  }, [project]);

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
  };

  const handleTrackOnClick = (): void => {
    sendAAEvent({
      eventName: BTC_PROJECT.CLICK_PROJECT,
      data: {
        project_id: project.tokenID,
        project_name: project.name,
        project_thumbnail: project.image,
      },
    });
  };

  const creatorMemo = useMemo((): User | null => {
    return creator;
  }, [creator]);

  const isMinted = useMemo((): boolean => {
    return (
      project.mintingInfo.index + project.mintingInfo.indexReserve >=
      (project.maxSupply || project.limit)
    );
  }, [project]);

  const isOnlyMintedShow = useMemo((): boolean => {
    return !project.btcFloorPrice && isMinted;
  }, [project, isMinted]);

  const minted = useMemo((): string => {
    return `${project.mintingInfo.index + project.mintingInfo.indexReserve}/${
      project.maxSupply || project.limit
    } minted`;
  }, [project]);

  const mintedOut = useMemo(() => {
    if (project) {
      return project?.maxSupply === project?.mintingInfo.index;
    }
    return false;
  }, [project?.maxSupply, project?.mintingInfo.index]);

  const filterNameAuthenticEth = useMemo((): string => {
    const creatorName =
      project?.creatorProfile?.displayName ||
      formatAddress(
        project?.creatorProfile?.walletAddressBtcTaproot ||
          project?.creatorProfile?.walletAddress ||
          ''
      );

    const isFromAuthentic = project?.fromAuthentic || false;
    if (isFromAuthentic && creatorName.toLowerCase() === 'authentic user') {
      return (
        project?.name ||
        formatAddress(
          project?.creatorProfile?.walletAddressBtcTaproot ||
            project?.creatorProfile?.walletAddress ||
            ''
        )
      );
    }
    return creatorName;
  }, [project]);

  const renderFooter = () => {
    if (project.btcFloorPrice && mintedOut) {
      return (
        <div className={s.row}>
          <span
            className={`${s.projectCard_info_price_price_minted} ${s.isOnlyMintedShow}`}
          >
            {minted}
          </span>
          <ButtonIcon sizes="xsmall">
            {`${formatBTCPrice(project.btcFloorPrice)} BTC`}
          </ButtonIcon>
        </div>
      );
    }
    if (mintedOut) {
      return (
        <div className={s.projectCard_info_mintoutContainer}>
          <SvgInset svgUrl={`${CDN_URL}/icons/ic_mintedout.svg`} />
          <Text className={s.projectCard_info_mintoutContainer_text}>
            {`${project?.mintingInfo.index} Minted out`}
          </Text>
        </div>
      );
    }
    return (
      <div className={`${s.projectCard_info_price_price}`}>
        <Text
          className={s.projectCard_info_price_price_wrap}
          size={'16'}
          fontWeight="medium"
          color="black-40-solid"
        >
          <span className={s.projectCard_info_price_price_el}>
            {project.btcFloorPrice
              ? `${formatBTCPrice(project.btcFloorPrice)} BTC`
              : !isMinted
              ? Number(project.mintPrice)
                ? `${formatBTCPrice(Number(project.mintPrice))} BTC`
                : 'Free'
              : ''}
          </span>
          <span
            className={`${s.projectCard_info_price_price_minted} ${
              isOnlyMintedShow ? s.isOnlyMintedShow : ''
            }`}
          >
            {minted}
          </span>
        </Text>
      </div>
    );
  };

  return (
    <Link
      href={`${ROUTE_PATH.GENERATIVE}/${project.tokenID}`}
      className={`${s.projectCard} ${className}`}
    >
      <div className={s.projectCard_inner} onClick={handleTrackOnClick}>
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
              ref={imgRef}
              onLoad={handleOnImgLoaded}
            />
          </div>
        </div>
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              {creator && (
                <Text size="11" fontWeight="medium">
                  {filterNameAuthenticEth}
                </Text>
              )}
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  {project.name}
                </Text>
              </div>

              <MintingProgressBar
                size={'small'}
                current={
                  project.mintingInfo.index + project.mintingInfo.indexReserve
                }
                total={project.maxSupply || project.limit}
              />
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              {creator && (
                <div className={s.projectCard_creator}>
                  <Text size={'20'} fontWeight="medium">
                    {creatorMemo?.displayName ||
                      formatLongAddress(creatorMemo?.walletAddressBtcTaproot)}
                  </Text>
                </div>
              )}
              <div className={s.projectCard_info_title}>
                <Heading as={'h6'} fontWeight="medium">
                  <span title={project.name}>{project.name}</span>
                </Heading>
              </div>
              <div className={s.projectCard_info_price}>{renderFooter()}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
