import { v4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import GltfPreviewApplication from './GltfPreviewApplication';
import styles from './styles.module.scss';

interface IProps {
  url: string;
}

const GLTFPreview: React.FC<IProps> = ({ url }) => {
  const [id] = useState(v4());
  const [isLoading, setIsLoading] = useState(true);
  const gltfPreviewAppRef = useRef<GltfPreviewApplication>();

  useEffect(() => {
    if (!gltfPreviewAppRef.current) {
      gltfPreviewAppRef.current = new GltfPreviewApplication(id);
    }
  }, [id]);

  useEffect(() => {
    if (url && gltfPreviewAppRef.current) {
      gltfPreviewAppRef.current.start(url as string, () => {
        setIsLoading(false);
      });
    }
  }, [url]);

  return (
    <>
      <div className={styles.gltfPreview}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        <div className={styles.viewer} id={id}></div>
      </div>
    </>
  );
};

export default GLTFPreview;
