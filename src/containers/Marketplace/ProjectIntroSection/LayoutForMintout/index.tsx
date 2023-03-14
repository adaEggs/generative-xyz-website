import Heading from '@components/Heading';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { convertIpfsToHttp } from '@utils/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { ProjectStats } from '../ProjectStats';
import s from './../styles.module.scss';

const LayoutForMintout = () => {
  const { project } = useContext(ProjectLayoutContext);
  const [thumb, setThumb] = useState<string>();

  const imgRef = useRef<HTMLImageElement>(null);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  const handleOnImgLoaded = (
    evt: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
  };

  // const { desktopScreen } = useWindowSize();

  useEffect(() => {
    if (project && project.image) {
      const url = convertIpfsToHttp(project.image);
      setThumb(url);
    }
  }, [project]);

  return (
    <div className={s.projectInfo}>
      <div className={`${s.projectInfo_inner}`}>
        <div className={`${s.projectInfo_left}`}>
          <div className={`${s.info}`}>
            <div className={s.info_inner}>
              {/* <ProjectName /> */}
              {/* {desktopScreen && <RenderMetaContent />} */}
              <div
                className={`${s.projectCard_thumb} ${
                  thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
                }`}
              >
                <div className={s.projectCard_thumb_inner}>
                  <img
                    onError={onThumbError}
                    src={thumb}
                    alt={project?.name}
                    loading={'lazy'}
                    ref={imgRef}
                    onLoad={handleOnImgLoaded}
                  />
                </div>
              </div>
              <div className={s.projectName}>
                <Heading as="h6" fontWeight="medium">
                  {project?.name}
                </Heading>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className={`${s.projectInfo_center} col-xl-5 col-12  order-xl-2 order-3`}
        >
          <ProjectDescription
            onlyDesc={true}
            desc={project?.desc || ''}
            hasInteraction={hasProjectInteraction}
            profileBio={project?.creatorProfile?.bio || ''}
          />
        </div> */}
        <div className={`${s.projectInfo_right}`}>
          <div className={s.projectInfo_right_inner}>{<ProjectStats />}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutForMintout;
