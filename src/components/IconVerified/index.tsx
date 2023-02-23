import { CDN_URL } from '@constants/config';
import Image from 'next/image';

export const IconVerified = () => {
  return (
    <Image
      width={34}
      height={34}
      src={`${CDN_URL}/icons/badge-check-34.svg`}
      alt={'badge-check'}
    />
  );
};
