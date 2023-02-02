import Skeleton from '@components/Skeleton';
import useWindowSize from '@hooks/useWindowSize';
import cs from 'classnames';
import s from './styles.module.scss';

const CollectionItemSkeleton = ({ className = '' }: { className: string }) => {
  const { mobileScreen } = useWindowSize();

  return (
    <div className={`${s.collectionCard} ${className}`}>
      <div className={s.collectionCard_inner}>
        <div className={`${s.collectionCard_thumb} ${s.isDefault}`} />
        {mobileScreen ? (
          <div className={cs(s.collectionCard_info, s.mobile)}>
            <Skeleton height={18} width={100} />
            <div
              className={s.collectionCard_info_title}
              style={{ marginTop: '5px' }}
            >
              <Skeleton height={24} width={50} />
            </div>
          </div>
        ) : (
          <div className={cs(s.collectionCard_info, s.desktop)}>
            <div className={s.collectionCard_info_skeleton}>
              <div className={s.collectionCard_owner_avatar}>
                <Skeleton fill />
              </div>
              <div className={s.collectionCard_owner_name}>
                <Skeleton width={100} height={14} />
              </div>
            </div>
            <div className={s.collectionCard_info_title_loading}>
              <Skeleton fill />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionItemSkeleton;
