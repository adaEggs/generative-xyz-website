import React from 'react';
import s from './styles.module.scss';

interface IProps {
  url: string;
  type: string;
}

const VideoPreview: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { url } = props;

  return (
    <div className={s.videoPreview}>
      <video autoPlay loop muted playsInline preload="auto">
        <source src={url} />
      </video>
    </div>
  );
};

export default VideoPreview;
