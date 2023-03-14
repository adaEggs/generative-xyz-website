import Skeleton from '@components/Skeleton';
import useWindowSize from '@hooks/useWindowSize';
import cs from 'classnames';
import s from './ProjectCard.module.scss';

const ProjectCardSkeleton = ({ className = '' }: { className: string }) => {
  const { mobileScreen } = useWindowSize();

  return (
    <div className={`${s.projectCard} ${className}`}>
      <div className={s.projectCard_inner}>
        <div className={`${s.projectCard_thumb} ${s.isDefault}`}>
          <div className={s.projectCard_thumb_inner}>
            <Skeleton fill className={s.projectCard_thumb_inner_sk} />
          </div>
        </div>
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
            <div className={s.projectCard_creator}>
              <div className={s.projectCard_name}>
                <Skeleton width={80} height={30} />
              </div>
            </div>
            <div className={s.projectCard_info_title}>
              <Skeleton width={250} height={30} />
            </div>
            <div className={s.projectCard_info_price_price}>
              <Skeleton width={100} height={30} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
