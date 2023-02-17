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

  if (fileExt && fileExt === 'glb') {
    return <GLTFPreview url={image} />;
  }

  return <></>;
};

export default ObjectPreview;
