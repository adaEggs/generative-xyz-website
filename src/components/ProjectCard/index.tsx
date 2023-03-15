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
import { formatBTCPrice } from '@utils/format';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import ButtonIcon from '@components/ButtonIcon';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { filterCreatorName } from '@utils/generative';
import { wordCase } from '@utils/common';

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

  const isAuthenticIn24h = useMemo((): boolean => {
    const providedDate = new Date(project.mintedTime);
    const currentDate = new Date();

    const delta = currentDate.getTime() - providedDate.getTime();
    const secondsAgo = delta / 1000;

    return Boolean(secondsAgo < 24 * 60 * 60);
  }, [project]);

  const renderFooter = () => {
    if (project.btcFloorPrice && mintedOut) {
      return (
        <div className={s.row}>
          <span
            className={`${s.projectCard_info_price_price_minted} ${s.isOnlyMintedShow}`}
          >
            {`${formatBTCPrice(project.btcFloorPrice)} BTC`}
          </span>
          <ButtonIcon sizes="xsmall">Buy</ButtonIcon>
        </div>
      );
    }
    if (mintedOut) {
      return (
        <div className={s.projectCard_info_edition}>
          <Text
            color="black-40-solid"
            fontWeight={'medium'}
            className={s.projectCard_info_edition_text}
          >
            {`${project?.mintingInfo.index} ${
              isAuthenticIn24h
                ? 'inscribed'
                : `Artwork${project?.mintingInfo.index > 1 ? 's' : ''}`
            }`}
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

  const projectName = useMemo((): string => {
    return project.fromAuthentic || false
      ? project.name.indexOf('Ordinal') === -1
        ? wordCase(`Ordinal ${project.name}`)
        : project.name
      : project.name;
  }, [project]);

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
                  {filterCreatorName(project)}
                </Text>
              )}
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  {projectName}
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
                    {filterCreatorName(project)}
                  </Text>
                </div>
              )}
              <div className={s.projectCard_info_title}>
                <Heading as={'h6'} fontWeight="medium">
                  <span title={projectName}>{projectName}</span>
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
