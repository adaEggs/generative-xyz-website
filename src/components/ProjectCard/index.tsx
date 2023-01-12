import { useEffect, useState } from 'react';

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

interface IPros {
  project: Project;
}

export const ProjectCard = ({ project }: IPros): JSX.Element => {
  const [creator, setCreator] = useState<User | null>(null);

  const [thumb, setThumb] = useState<string>(project.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  useEffect(() => {
    if (project.creatorProfile) {
      setCreator(project.creatorProfile);
    }
  }, [project]);

  return (
    <Link
      href={`${ROUTE_PATH.GENERATIVE}/${project.tokenID}`}
      className={s.projectCard}
    >
      <div className={s.projectCard_inner}>
        <div
          className={`${s.projectCard_thumb} ${
            thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
          }`}
        >
          <img
            onError={onThumbError}
            src={convertIpfsToHttp(thumb)}
            alt={project.name}
            loading={'lazy'}
          />
        </div>
        <div className={s.projectCard_info}>
          <div className={s.projectCard_info_title}>
            <Heading as={'h4'}>{project.name}</Heading>
          </div>
          {creator && <CreatorInfo creator={creator} />}
          <ProgressBar
            size={'small'}
            current={
              project.mintingInfo.index + project.mintingInfo.indexReserve
            }
            total={project.limit}
          />
        </div>
      </div>
    </Link>
  );
};
