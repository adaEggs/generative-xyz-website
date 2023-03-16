import React, { useState } from 'react';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { convertIpfsToHttp } from '@utils/image';
import s from './TokenID.module.scss';
import Skeleton from '@components/Skeleton';

interface IProps {
  image: string;
  name: string;
}

const TokenIDImage = React.memo((props: IProps) => {
  const [thumb, setThumb] = useState<string>(props.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  React.useEffect(() => {
    if (props.image) {
      setThumb(props.image);
    }
  }, [props.image]);
  return (
    <div className={s.img_inner}>
      <div className={s.img_wrapper}>
        <Skeleton fill isLoaded={!!props.image} />
        {thumb !== LOGO_MARKETPLACE_URL ? (
          <iframe
            sandbox="allow-scripts allow-pointer-lock allow-downloads"
            scrolling="no"
            loading="lazy"
            src={thumb}
          />
        ) : (
          <img
            onError={onThumbError}
            src={convertIpfsToHttp(thumb)}
            alt={props.name}
            loading={'lazy'}
          />
        )}
      </div>
    </div>
  );
});

TokenIDImage.displayName = 'TokenIDImage';

export default TokenIDImage;
