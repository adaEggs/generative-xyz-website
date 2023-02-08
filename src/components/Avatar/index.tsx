import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import React from 'react';
import styles from './styles.module.scss';
import { v4 } from 'uuid';
import { convertIpfsToHttp } from '@utils/image';
import cs from 'classnames';

type Props = {
  imgSrcs: string | string[];
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
};

const Avatar = ({
  imgSrcs,
  width = 48,
  height = 48,
  fill = false,
  className,
}: Props) => {
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
            src={`${CDN_URL}/images/default-avatar.jpeg`}
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
      <div className={cs(styles.avatarStack, className)}>
        {imgSrcs.map(src => (
          <SingleAvatar src={src} key={`avatar-${v4()}`} />
        ))}
      </div>
    );
  }

  return null;
};

export default Avatar;
