import Skeleton from '@components/Skeleton';
import React from 'react';
import s from './styles.module.scss';

const CurrentResultSkeleton: React.FC = (): React.ReactElement => {
  return (
    <div className={s.currentResultSkeleton}>
      <div className={s.titleSkeleton}>
        <Skeleton fill></Skeleton>
      </div>
      <div className={s.descriptionSkeleton}>
        <Skeleton fill></Skeleton>
      </div>
      <div className={s.actionSkeleton}>
        <Skeleton fill></Skeleton>
      </div>
    </div>
  );
};

export default CurrentResultSkeleton;
