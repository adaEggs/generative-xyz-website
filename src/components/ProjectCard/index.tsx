import { useEffect, useMemo, useState } from 'react';

import s from './ProjectCard.module.scss';

import { CreatorInfo } from '@components/CreatorInfo';
import Heading from '@components/Heading';
import Link from '@components/Link';
import ProgressBar from '@components/ProgressBar';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { Project } from '@interfaces/project';
import { User } from '@interfaces/user';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import { formatAddress } from '@utils/format';
import { checkIsBitcoinProject } from '@utils/generative';
import { CountDown } from '@components/CountDown';

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
              {isBitcoinProject && (
                <CountDown
                  openMintUnixTimestamp={project?.openMintUnixTimestamp || 0}
                  closeMintUnixTimestamp={project?.closeMintUnixTimestamp || 0}
                />
              )}
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
              {isBitcoinProject && (
                <CountDown
                  openMintUnixTimestamp={project?.openMintUnixTimestamp || 0}
                  closeMintUnixTimestamp={project?.closeMintUnixTimestamp || 0}
                />
              )}
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>{project.name}</span>
                </Heading>
              </div>
              {creator && <CreatorInfo creator={creatorMemo} />}
              <ProgressBar
                size={'small'}
                current={
                  project.mintingInfo.index + project.mintingInfo.indexReserve
                }
                total={project.maxSupply || project.limit}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
