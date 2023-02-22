import { CDN_URL, GLB_COLLECTION_ID } from '@constants/config';
import { MediaType } from '@enums/file';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { getMediaTypeFromFileExt } from '@utils/file';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import ImagePreview from '../ImagePreview';
import Model3DPreview from '../Model3DPreview';
import VideoPreview from '../VideoPreview';
import Image from 'next/image';
import s from './styles.module.scss';
import AudioPreview from '../AudioPreview';

interface IProps {
  data: Token | Project | null;
}

const PreviewController: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { data } = props;
  const router = useRouter();
  const { projectID } = router.query as { projectID: string };
  const thumbnailUrl = useMemo(() => {
    return data?.image || '';
  }, [data]);
  const thumbnailExt = thumbnailUrl.split('.').pop() || '';

  const renderPlaceholderThumbnail = useMemo(
    (): React.ReactElement => (
      <div className={s.placeholderThumbnail}>
        <Image
          alt="thumbnail"
          width={200}
          height={200}
          src={`${CDN_URL}/icons/genertive-placeholder.svg`}
        />
      </div>
    ),
    []
  );

  const renderPreviewByType = useMemo((): React.ReactElement => {
    const mediaType = getMediaTypeFromFileExt(thumbnailExt);
    if (!mediaType) {
      return <></>;
    }

    if (projectID === GLB_COLLECTION_ID) {
      return (
        <Model3DPreview
          tokenID={data?.tokenID ?? ''}
          projectID={projectID}
          thumbnailExt={thumbnailExt}
        />
      );
    }

    switch (mediaType) {
      case MediaType.IMAGE:
        return <ImagePreview url={thumbnailUrl} />;
      case MediaType.MODEL_3D:
        return (
          <Model3DPreview
            tokenID={data?.tokenID ?? ''}
            projectID={projectID}
            thumbnailExt={thumbnailExt}
          />
        );
      case MediaType.VIDEO:
        return <VideoPreview url={thumbnailUrl} type={thumbnailExt} />;
      case MediaType.AUDIO:
        return <AudioPreview url={thumbnailUrl} />;
      default:
        return renderPlaceholderThumbnail;
    }
  }, [thumbnailExt, thumbnailUrl, data, projectID]);

  if (!data) {
    return <></>;
  }

  return renderPreviewByType;
};

export default PreviewController;
