import { DEFAULT_USER_AVATAR } from '@constants/common';
import { convertIpfsToHttp } from '@utils/image';
import Image from 'next/image';
import { memo } from 'react';
import styles from './styles.module.scss';

type Props = {
  imgSrcs: string | string[];
  width?: number;
  height?: number;
  fill?: boolean;
};

const Avatar = memo(
  ({ imgSrcs, width = 48, height = 48, fill = false }: Props) => {
    const SingleAvatar = ({ src }: { src: string }) => {
      return (
        <div
          style={
            fill
              ? {
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }
              : {
                  width,
                  height,
                }
          }
          className={styles.avatarWrapper}
        >
          {src ? (
            fill ? (
              <Image src={convertIpfsToHttp(src)} alt="user avatar" fill />
            ) : (
              <Image
                className={styles.ownerAvatar}
                src={convertIpfsToHttp(src)}
                alt="user avatar"
                width={width}
                height={height}
              />
            )
          ) : (
            <Image
              className={styles.ownerAvatar}
              alt="owner avatar"
              src={DEFAULT_USER_AVATAR}
              width={width}
              height={height}
            />
          )}
        </div>
      );
    };

    if (typeof imgSrcs === 'string') return <SingleAvatar src={imgSrcs} />;

    if (imgSrcs?.length > 0 && typeof imgSrcs === 'object') {
      return (
        <div className={styles.avatarStack}>
          {imgSrcs.map((src, index) => (
            <SingleAvatar src={src} key={`avatar-${index}`} />
          ))}
        </div>
      );
    }

    return null;
  }
);

Avatar.displayName = 'Avatar';
export default Avatar;
