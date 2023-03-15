import { CDN_URL } from '@constants/config';
import Image from 'next/image';

export const IconVerified = ({
  width = 34,
  height = 34,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      width={width}
      height={height}
      src={`${CDN_URL}/icons/badge-check-34.svg`}
      alt={'badge-check'}
    />
  );
};
