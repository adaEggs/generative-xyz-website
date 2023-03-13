import Skeleton from '@components/Skeleton';
import s from './styles.module.scss';

const ArtistCardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`${s.artistCard} ${className}`}>
      <div className={s.artistCard_inner}>
        <div className={`${s.artistCard_thumb}`}>
          <div className={s.artistCard_thumb_inner}>
            <Skeleton fill className={s.artistCard_thumb_inner_sk} />
          </div>
        </div>
        <div className={s.artistCard_info}>
          <Skeleton width={100} height={30} />
          <Skeleton width={250} height={30} />
        </div>
      </div>
    </div>
  );
};

export default ArtistCardSkeleton;
