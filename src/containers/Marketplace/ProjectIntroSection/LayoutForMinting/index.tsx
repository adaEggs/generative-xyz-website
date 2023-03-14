import ProjectDescription from '@components/ProjectDescription';
import ThumbnailPreview from '@components/ThumbnailPreview';
import { Project } from '@interfaces/project';
import { useContext } from 'react';
import s from './../styles.module.scss';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import useWindowSize from '@hooks/useWindowSize';
import { ProjectName } from '@containers/Marketplace/ProjectIntroSection/ProjectName';
import { PropertyAndCta } from '@containers/Marketplace/ProjectIntroSection/PropertyAndCta';
import { SocialAndReport } from '@containers/Marketplace/ProjectIntroSection/SocailAndReport';
import { RenderProjectAttrs } from '@containers/Marketplace/ProjectIntroSection/ProjectAttrs';

const ProjectIntroSection = () => {
  const { project, hasProjectInteraction, projectDetail } =
    useContext(ProjectLayoutContext);
  const { mobileScreen } = useWindowSize();
  return (
    <div className={`${s.layoutMinting} container`}>
      <div className="row">
        <div className="col-xl-4 col-md-6 col-12">
          <div className={`${s.info_wrapper} ${s.layoutMinting_left}`}>
            <div className={s.info}>
              <ProjectName />
              {mobileScreen && (
                <div className={s.reviewOnMobile}>
                  <ThumbnailPreview
                    data={
                      {
                        ...projectDetail,
                        htmlFile: project?.htmlFile || '',
                        animationHtml: project?.animationHtml || '',
                      } as unknown as Project
                    }
                    allowVariantion
                  />
                </div>
              )}
              <PropertyAndCta />
              <div className={s.project_info}>
                <ProjectDescription
                  desc={project?.desc || ''}
                  hasInteraction={hasProjectInteraction}
                  profileBio={project?.creatorProfile?.bio || ''}
                />
                <RenderProjectAttrs />
              </div>
            </div>
            <SocialAndReport />
          </div>
        </div>
        {!mobileScreen && (
          <div className="col-xl-8 col-md-6 col-12">
            <div className={s.ThumbnailPreview}>
              <ThumbnailPreview
                data={
                  {
                    ...projectDetail,
                    htmlFile: project?.htmlFile || '',
                    animationHtml: project?.animationHtml || '',
                  } as unknown as Project
                }
                allowVariantion
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIntroSection;
