import { GLB_EXTENSION } from '@constants/file';
import { Token } from '@interfaces/token';
import { useMemo } from 'react';
import GLTFPreview from './GltfPreview';

interface IProps {
  token: Token;
}

const ObjectPreview: React.FC<IProps> = ({ token }) => {
  const { image } = token;

  const fileExt = useMemo(() => {
    return image?.split('.').pop();
  }, [image]);

  if (fileExt && fileExt === GLB_EXTENSION) {
    return <GLTFPreview whiteHouse url={image} download />;
  }

  return <></>;
};

export default ObjectPreview;
