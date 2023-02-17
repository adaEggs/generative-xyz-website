import { useEffect, useMemo, useState } from 'react';

import s from './ProjectCard.module.scss';

import Avatar from '@components/Avatar';
import Heading from '@components/Heading';
import Link from '@components/Link';
import ProgressBar from '@components/ProgressBar';
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
import { checkIsBitcoinProject } from '@utils/generative';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import { Stack } from 'react-bootstrap';
// import { CountDown } from '@components/CountDown';

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

  const isBitcoinProject = useMemo((): boolean => {
    if (!project) return false;
    return checkIsBitcoinProject(project.tokenID);
  }, [project]);

  useEffect(() => {
    if (project.creatorProfile) {
      setCreator(project.creatorProfile);
    }
  }, [project]);

  const creatorMemo = useMemo((): User | null => {
    return creator;
  }, [creator]);

  const isLimitMinted = useMemo((): boolean => {
    if (!project) return false;
    return project?.mintingInfo?.index < project?.maxSupply;
  }, [project]);

  return (
    <Link
      href={`${ROUTE_PATH.GENERATIVE}/${project.tokenID}`}
      className={`${s.projectCard} ${className}`}
    >
      <div className={s.projectCard_inner}>
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
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              {/*{isBitcoinProject && (*/}
              {/*  <CountDown*/}
              {/*    openMintUnixTimestamp={project?.openMintUnixTimestamp || 0}*/}
              {/*    closeMintUnixTimestamp={project?.closeMintUnixTimestamp || 0}*/}
              {/*  />*/}
              {/*)}*/}
              {creator && (
                <Text size="11" fontWeight="medium">
                  {creator.displayName || formatAddress(creator.walletAddress)}
                </Text>
              )}
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  {project.name}
                </Text>
              </div>

              <ProgressBar
                size={'small'}
                current={
                  project.mintingInfo.index + project.mintingInfo.indexReserve
                }
                total={project.maxSupply || project.limit}
              />
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              {/*{isBitcoinProject && (*/}
              {/*  <CountDown*/}
              {/*    openMintUnixTimestamp={project?.openMintUnixTimestamp || 0}*/}
              {/*    closeMintUnixTimestamp={project?.closeMintUnixTimestamp || 0}*/}
              {/*  />*/}
              {/*)}*/}
              <div className={s.projectCard_info_title}>
                <Heading as={'h5'} fontWeight="medium">
                  <span title={project.name}>{project.name}</span>
                </Heading>
              </div>
              {isBitcoinProject ? (
                <div className={s.projectCard_info_price}>
                  <div className={s.projectCard_info_price_bar}>
                    {/* <ProgressBar
                      size={'small'}
                      isHideBar={true}
                      current={
                        project.mintingInfo.index +
                        project.mintingInfo.indexReserve
                      }
                      total={project.maxSupply || project.limit}
                    /> */}
                    <div className={s.progress_minted}>
                      <Heading as="h6" fontWeight="bold">
                        {project.mintingInfo.index +
                          project.mintingInfo.indexReserve}
                        /{project.maxSupply || project.limit}
                      </Heading>
                      <Heading as="h6" color="black-60">
                        minted
                      </Heading>
                    </div>
                  </div>
                  {isLimitMinted ? (
                    <>
                      <span className={s.dots}></span>
                      <div className={s.projectCard_info_price_price}>
                        <Stack direction="horizontal" gap={2}>
                          {Number(project.mintPrice) ? (
                            <>
                              <Heading as="h6" fontWeight="bold">
                                {formatBTCPrice(Number(project.mintPrice))}
                              </Heading>
                              <Heading as="h6" color="black-60">
                                BTC
                              </Heading>
                            </>
                          ) : (
                            <Heading as="h6" fontWeight="bold">
                              Free
                            </Heading>
                          )}
                          <Heading as="h6" color="black-60">
                            mint
                          </Heading>
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <ProgressBar
                  size={'small'}
                  current={
                    project.mintingInfo.index + project.mintingInfo.indexReserve
                  }
                  total={project.maxSupply || project.limit}
                />
              )}
              {creator && (
                <div className={s.projectCard_creator}>
                  <Avatar
                    imgSrcs={creatorMemo?.avatar || ''}
                    width={24}
                    height={24}
                  />
                  <Text fontWeight="medium" color="black-60">
                    {creatorMemo?.displayName ||
                      formatLongAddress(creatorMemo?.walletAddress)}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
