import s from './styles.module.scss';
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
import AudioPreview from '../AudioPreview';
import IFramePreview from '../IframePreview';
import PDFPreview from '../PDFPreview';

interface IProps {
  data: Token | Project | null;
}

const PreviewController: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { data } = props;
  const router = useRouter();
  const { projectID, tokenID } = router.query as {
    projectID: string;
    tokenID: string;
  };
  const previewUrl = useMemo(() => {
    return data?.image || '';
  }, [data]);
  const thumbnailUrl = useMemo(() => {
    return (data as Token)?.thumbnail || '';
  }, [data]);
  const thumbnailExt = thumbnailUrl.split('.').pop() || '';
  const previewExt = previewUrl.split('.').pop() || '';

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
    // Check ordinal
    const isOrdinalPreview = previewUrl.includes('i0');
    if (isOrdinalPreview) {
      return <IFramePreview url={previewUrl} />;
    }

    // Check hardcode glb collection
    if (!tokenID && projectID === GLB_COLLECTION_ID) {
      return (
        <Model3DPreview
          tokenID={data?.tokenID ?? ''}
          projectID={projectID}
          previewExt={previewExt}
          thumbnailExt={thumbnailExt}
        />
      );
    }

    const mediaType = getMediaTypeFromFileExt(previewExt);
    switch (mediaType) {
      case MediaType.IMAGE:
        return <ImagePreview url={previewUrl} />;
      case MediaType.MODEL_3D:
        return (
          <Model3DPreview
            tokenID={data?.tokenID ?? ''}
            projectID={projectID}
            previewExt={previewExt}
            thumbnailExt={thumbnailExt}
          />
        );
      case MediaType.VIDEO:
        return <VideoPreview url={previewUrl} type={previewExt} />;
      case MediaType.AUDIO:
        return <AudioPreview url={previewUrl} />;
      case MediaType.IFRAME:
        return <IFramePreview url={previewUrl} />;
      case MediaType.PDF:
        return <PDFPreview url={previewUrl} />;
      default:
        return renderPlaceholderThumbnail;
    }
  }, [previewExt, previewUrl, data, projectID, tokenID]);

  if (!data) {
    return <></>;
  }

  return renderPreviewByType;
};

export default PreviewController;
