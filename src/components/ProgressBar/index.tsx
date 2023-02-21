import React from 'react';
import s from './styles.module.scss';

interface IProps {
  percent: number;
  height?: number;
}

const ProgressBar: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { percent, height = 4 } = props;

  return (
    <div className={s.progressBar}>
      <div className={s.totalBar}>
        <div
          className={s.activeBar}
          style={{
            width: `${percent}%`,
            height: `${height}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
