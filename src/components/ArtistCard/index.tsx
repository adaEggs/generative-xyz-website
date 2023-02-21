import s from './styles.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import { User } from '@interfaces/user';
import Image from 'next/image';
import Text from '@components/Text';
import { formatAddress } from '@utils/format';
import { useMemo } from 'react';

interface IPros {
  profile: User;
  className?: string;
}

export const ArtistCard = ({ profile, className }: IPros): JSX.Element => {
  // console.log('___profile', profile);

  const arts = useMemo((): string => {
    let artNames = '';
    profile?.projects?.forEach(project => {
      artNames += `${project.name}, `;
    });

    return artNames;
  }, [profile]);
  return (
    <Link
      href={`${ROUTE_PATH.PROFILE}/${profile.walletAddress}`}
      className={`${s.artistCard} ${className}`}
    >
      <div className={s.artistCard_inner}>
        <div className={`${s.artistCard_thumb}`}>
          <div className={s.artistCard_thumb_inner}>
            <Image
              src={profile.avatar}
              alt={'avatar'}
              width={'432'}
              height={'432'}
            />
          </div>
        </div>
        <div className={s.artistCard_inner_info}>
          <Text size="11" fontWeight="medium">
            {profile.displayName || formatAddress(profile.walletAddress)}
          </Text>

          <div className={s.projectCard_info_title}>
            <Text size="14" fontWeight="semibold">
              {arts}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
};
