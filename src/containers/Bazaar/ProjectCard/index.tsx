import { useEffect, useMemo, useState } from 'react';

import s from './ProjectCard.module.scss';

import { CreatorInfo } from '@components/CreatorInfo';
import Heading from '@components/Heading';
import Link from '@components/Link';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { Project } from '@interfaces/project';
import { User } from '@interfaces/user';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';
import useWindowSize from '@hooks/useWindowSize';
import Text from '@components/Text';
import { formatAddress } from '@utils/format';

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
      href={`${ROUTE_PATH.BAZAAR}/${project.tokenID}`}
      className={`${s.projectCard} ${className}`}
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
        <div className={s.projectCard_inner_info}>
          {mobileScreen ? (
            <div className={cs(s.projectCard_info, s.mobile)}>
              {creator && (
                <Text size="11" fontWeight="medium">
                  {creator.displayName || formatAddress(creator.walletAddress)}
                </Text>
              )}
              <div className={s.projectCard_info_title}>
                <Text size="14" fontWeight="semibold">
                  #{project.name}
                </Text>
                <Text size="12" fontWeight="semibold">
                  0.2BTC
                </Text>
              </div>
            </div>
          ) : (
            <div className={cs(s.projectCard_info, s.desktop)}>
              {creator && <CreatorInfo creator={creatorMemo} />}
              <div className={s.projectCard_info_title}>
                <Heading as={'h4'}>
                  <span title={project.name}>{project.name}</span>
                </Heading>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
