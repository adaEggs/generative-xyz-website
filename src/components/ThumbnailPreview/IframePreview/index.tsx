import React from 'react';
import s from './styles.module.scss';

interface IProps {
  url: string;
}

const IFramePreview: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { url } = props;

  return (
    <div className={s.iframePreview}>
      <iframe
        className={s.iframeContainer}
        src={url}
        style={{ overflow: 'hidden' }}
      />
    </div>
  );
};

export default IFramePreview;
