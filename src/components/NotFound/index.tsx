import Image from 'next/image';
import React from 'react';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import Heading from '@components/Heading';

type TNotFound = {
  infoText: string;
};

const NotFound = ({ infoText }: TNotFound) => {
  return (
    <div className={s.notFound}>
      <Image
        width={75}
        height={99}
        src={`${CDN_URL}/icons/ic-empty.svg`}
        alt="Not found item"
        className={s.notFound_image}
      />
      <Heading as="h5" fontWeight="semibold">
        {infoText}
      </Heading>
    </div>
  );
};

export default NotFound;
