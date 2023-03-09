import s from './styles.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import { User } from '@interfaces/user';
import Image from 'next/image';
import Text from '@components/Text';
import { formatAddress } from '@utils/format';
import { useMemo, useRef } from 'react';
import { DEFAULT_USER_AVATAR } from '@constants/common';

interface IPros {
  profile: User;
  className?: string;
}

export const ArtistCard = ({ profile, className }: IPros): JSX.Element => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
  };

  const arts = useMemo((): string => {
    let artNames = '';
    profile?.projects?.forEach((project, key) => {
      if (profile.projects?.length && key < profile.projects?.length - 1) {
        artNames += `${project.name}, `;
      } else {
        artNames += `${project.name}`;
      }
    });

    return artNames.trim();
  }, [profile]);

  return (
    <Link
      href={`${ROUTE_PATH.PROFILE}/${
        profile?.walletAddressBtcTaproot || profile?.walletAddress
      }`}
      className={`${s.artistCard} ${className}`}
    >
      <div className={s.artistCard_inner}>
        <div className={`${s.artistCard_thumb}`}>
          <div className={s.artistCard_thumb_inner}>
            <Image
              src={profile.avatar ? profile.avatar : DEFAULT_USER_AVATAR}
              alt={'avatar'}
              width={'432'}
              height={'432'}
              ref={imgRef}
              onLoad={handleOnImgLoaded}
            />
          </div>
        </div>
        <div className={s.artistCard_info}>
          <Text size="20" fontWeight="medium" color="white">
            {profile.displayName ||
              formatAddress(profile.walletAddressBtcTaproot)}
          </Text>
          <Text
            className={s.artistCard_info_arts}
            size="20"
            fontWeight="medium"
            color="black-40-solid"
          >
            {arts}
          </Text>
        </div>
      </div>
    </Link>
  );
};
