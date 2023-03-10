import ProjectDescription from '@components/ProjectDescription';
import s from './../styles.module.scss';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { useContext } from 'react';
import useWindowSize from '@hooks/useWindowSize';
import { RenderMetaContent } from '@containers/Marketplace/ProjectIntroSection/MetaContent';
import { ProjectProperty } from '@containers/Marketplace/ProjectIntroSection/ProjectProperty';
import { ProjectName } from '@containers/Marketplace/ProjectIntroSection/ProjectName';

const LayoutForMintout = () => {
  const { project, hasProjectInteraction, isLimitMinted } =
    useContext(ProjectLayoutContext);

  const { desktopScreen } = useWindowSize();

  return (
    <div className={s.projectInfo}>
      <div className={`${s.projectInfo_inner} row`}>
        <div className={`${s.projectInfo_left} col-xl-3 col-sm-6 col-12`}>
          <div className={`${s.info} ${!isLimitMinted ? s.isSmall : ''}`}>
            <div className={s.info_inner}>
              <ProjectName />
              {desktopScreen && <RenderMetaContent />}
            </div>
          </div>
        </div>
        <div
          className={`${s.projectInfo_center} col-xl-5 col-12  order-xl-2 order-3`}
        >
          <ProjectDescription
            desc={project?.desc || ''}
            hasInteraction={hasProjectInteraction}
            profileBio={project?.creatorProfile?.bio || ''}
          />
        </div>
        <div
          className={`${s.projectInfo_right} col-xl-3 col-sm-6 col-12 offset-xl-1 order-xl-3 order-2`}
        >
          <div className={s.projectInfo_right_inner}>{<ProjectProperty />}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutForMintout;
