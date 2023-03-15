import cn from 'classnames';

import Skeleton from '@components/Skeleton';

import s from './SkeletonItem.module.scss';

const SkeletonItem = ({ className = '' }: { className?: string }) => {
  return (
    <div className={cn(s.skeletonItem, className)}>
      <Skeleton height={50} className={s.skeletonItem_item} />
    </div>
  );
};

export default SkeletonItem;
