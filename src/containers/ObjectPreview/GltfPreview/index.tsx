import { v4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import GltfPreviewApplication from './GltfPreviewApplication';
import styles from './styles.module.scss';
import Instruction from '../components/Instruction';

interface IProps {
  url: string;
  whiteHouse?: boolean;
}

const GLTFPreview: React.FC<IProps> = ({ url, whiteHouse = false }) => {
  const [id] = useState(v4());
  const [isLoading, setIsLoading] = useState(true);
  const [isShowInstruction, setIsShowInstruction] = useState(true);
  const gltfPreviewAppRef = useRef<GltfPreviewApplication>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clearTimeOutHandler: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyDownHandler = (e: any) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
        setIsShowInstruction(false);
      }
    };
    window.addEventListener('keydown', keyDownHandler);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyUpHandler = () => {
      if (clearTimeOutHandler) {
        clearTimeout(clearTimeOutHandler);
      }
      clearTimeOutHandler = setTimeout(() => {
        setIsShowInstruction(true);
      }, 1000);
    };
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (!gltfPreviewAppRef.current) {
      gltfPreviewAppRef.current = new GltfPreviewApplication(id, whiteHouse);
    }
  }, [id]);

  useEffect(() => {
    if (url && gltfPreviewAppRef.current) {
      gltfPreviewAppRef.current.start(url as string, () => {
        setIsLoading(false);
        // setIsLoaded(true);
      });
    }
  }, [url]);

  return (
    <>
      <div className={styles.gltfPreview}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        <div className={styles.viewer} id={id}></div>
        {isShowInstruction && <Instruction className={styles.instruction} />}
      </div>
    </>
  );
};

export default GLTFPreview;
