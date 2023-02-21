import { Token } from '@interfaces/token';
import React, { useMemo } from 'react';

interface IProps {
  data: Token | null;
}

const CollectionPreview: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { data } = props;
  const thumbnailPreviewUrl = data?.image;

  const renderPreviewByExt = useMemo(() => {
    return <></>;
  }, [])

  return renderPreviewByExt;
};

export default CollectionPreview;
