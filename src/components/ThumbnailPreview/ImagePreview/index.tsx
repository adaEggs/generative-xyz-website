import React from 'react';
import Image from 'next/image';
import { convertIpfsToHttp } from '@utils/image';
import s from './styles.module.scss';

interface IProps {
  url: string;
}

const ImagePreview: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const {
    url,
  } = props;

  return (
    <div className={s.imagePreview}>
      <Image
        fill
        src={convertIpfsToHttp(url)}
        alt="thumbnail"
      />
    </div>
  )
}

export default ImagePreview;
