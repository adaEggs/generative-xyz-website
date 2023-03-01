import { v4 } from 'uuid';
import { useEffect, useMemo, useRef, useState } from 'react';
import GltfPreviewApplication from './GltfPreviewApplication';
import styles from './styles.module.scss';
import Instruction from '../components/Instruction';

interface IProps {
  url: string;
  whiteHouse?: boolean;
  download?: false;
}

const GLTFPreview: React.FC<IProps> = ({
  url,
  whiteHouse = false,
  download = false,
}) => {
  const [id] = useState(v4());
  const [isLoading, setIsLoading] = useState(true);
  const [isShowInstruction, setIsShowInstruction] = useState(true);
  const gltfPreviewAppRef = useRef<GltfPreviewApplication>();

  const [totalLoaderStep, setTotalLoaderStep] = useState(0);
  const [stepDone, setStepDone] = useState(0);

  useEffect(() => {
    const keyStates: Record<string, boolean> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clearTimeOutHandler: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyDownHandler = (e: any) => {
      keyStates[e.code] = true;
      setIsShowInstruction(false);
    };
    window.addEventListener('keydown', keyDownHandler);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyUpHandler = (e: any) => {
      keyStates[e.code] = false;
      if (clearTimeOutHandler) {
        clearTimeout(clearTimeOutHandler);
      }
      clearTimeOutHandler = setTimeout(() => {
        if (Object.values(keyStates).every(v => !v)) {
          setIsShowInstruction(true);
        }
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
      gltfPreviewAppRef.current.start(
        url as string,
        totalStep => {
          setTotalLoaderStep(totalStep);
        },
        doneStep => {
          setStepDone(doneStep);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  }, [url]);

  const processBar = useMemo(() => {
    if (totalLoaderStep) {
      return `${(stepDone / totalLoaderStep) * 100}%`;
    }
    return `0%`;
  }, [stepDone, totalLoaderStep]);

  return (
    <>
      <div className={styles.gltfPreview}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingText}>
              <div>Loading...</div>
              <div
                className={styles.loadingProcess}
                style={{
                  width: processBar,
                }}
              ></div>
            </div>
          </div>
        )}
        <div className={styles.viewer} id={id}></div>
        {isShowInstruction && (
          <Instruction
            download={download}
            className={styles.instruction}
            url={url}
          />
        )}
      </div>
    </>
  );
};

export default GLTFPreview;
