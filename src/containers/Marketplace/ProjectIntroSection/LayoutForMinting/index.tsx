import ProjectDescription from '@components/ProjectDescription';
import Text from '@components/Text';
import ThumbnailPreview from '@components/ThumbnailPreview';
import { Project } from '@interfaces/project';
import { useContext } from 'react';
import s from './../styles.module.scss';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import useWindowSize from '@hooks/useWindowSize';
import { ProjectName } from '@containers/Marketplace/ProjectIntroSection/ProjectName';
import { PropertyAndCta } from '@containers/Marketplace/ProjectIntroSection/PropertyAndCta';
import { SocialAndReport } from '@containers/Marketplace/ProjectIntroSection/SocailAndReport';

const ProjectIntroSection = () => {
  const {
    project,
    mintedDate,
    isFullonChain,
    hasProjectInteraction,
    projectDetail,
  } = useContext(ProjectLayoutContext);
  const { mobileScreen } = useWindowSize();
  return (
    <div className={s.layoutMinting}>
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
            <>
              <Text size="14" color="black-40">
                Created date: {mintedDate}
              </Text>

              <Text size="14" color="black-40">
                Fully on-chain: {isFullonChain ? 'Yes' : 'No'}
              </Text>
            </>
          </div>
        </div>
        <SocialAndReport />
      </div>
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
  );
};

export default ProjectIntroSection;
