import Skeleton from '@components/Skeleton';
import useWindowSize from '@hooks/useWindowSize';
import cs from 'classnames';
import s from './ProjectCard.module.scss';

const InscriptionCardSkeleton = ({ className = '' }: { className: string }) => {
  const { mobileScreen } = useWindowSize();

  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        <div className={`${s.projectCard_thumb} ${s.isDefault}`} />
        {mobileScreen ? (
          <div className={cs(s.projectCard_info, s.mobile)}>
            <Skeleton height={14} width={50} />
            <div className={s.projectCard_info_title}>
              <Skeleton height={18} width={100} />
            </div>
            <div className={s.projectCard_progress}>
              <Skeleton fill />
            </div>
          </div>
        ) : (
          <div className={cs(s.projectCard_info, s.desktop)}>
            <div className={s.projectCard_info_title}>
              <Skeleton width={180} height={30} />
            </div>
            <div className={s.projectCard_creator}>
              <div className={s.projectCard_avatar}>
                <Skeleton fill />
              </div>
              <div className={s.projectCard_name}>
                <Skeleton width={80} height={14} />
              </div>
            </div>
            <div className={s.projectCard_progress}>
              <Skeleton fill />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionCardSkeleton;
