import ClientOnly from '@components/Utils/ClientOnly';
import { GLB_COLLECTION_ID } from '@constants/config';
import { GLB_EXTENSION } from '@constants/file';
import { ROUTE_PATH } from '@constants/route-path';
import React from 'react';
import s from './styles.module.scss';

interface IProps {
  tokenID: string;
  projectID: string;
  previewExt: string;
  thumbnailExt: string;
}

const Model3DPreview: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { tokenID, projectID, previewExt } = props;

  return (
    <ClientOnly>
      <div className={s.model3dPreview}>
        {previewExt && previewExt === GLB_EXTENSION && tokenID && (
          <div className={s.objectPreview}>
            <iframe
              className={s.iframeContainer}
              src={`${ROUTE_PATH.OBJECT_PREVIEW}/${tokenID}`}
              style={{ overflow: 'hidden' }}
            />
          </div>
        )}
        {!tokenID && projectID === GLB_COLLECTION_ID && (
          <div className={s.objectPreview}>
            <iframe
              className={s.iframeContainer}
              src={`${ROUTE_PATH.GLTF_PREVIEW}?defaultUrl=true`}
              style={{ overflow: 'hidden' }}
            />
          </div>
        )}
      </div>
    </ClientOnly>
  );
};

export default Model3DPreview;
