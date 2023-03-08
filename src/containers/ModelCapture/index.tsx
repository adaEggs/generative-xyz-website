import { Loading } from '@components/Loading';
import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { LogLevel } from '@enums/log-level';
import { Token } from '@interfaces/token';
import { getTokenUri } from '@services/token-uri';
import log from '@utils/logger';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import s from './styles.module.scss';
const ModelViewer = dynamic(() => import('@components/ModelViewer'), {
  ssr: false,
});

const LOG_PREFIX = 'ModelCapture';

const ModelCapture: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { projectID, tokenID } = router.query as {
    projectID: string;
    tokenID: string;
  };
  const [tokenData, setTokenData] = useState<Token | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);

  useAsyncEffect(async () => {
    try {
      if (tokenID && projectID) {
        const res = await getTokenUri({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          tokenID,
        });
        setTokenData(res);
      }
    } catch (err: unknown) {
      log('failed to fetch item detail', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [projectID, tokenID]);

  // const handleOnModelLoaded = (): void => {
  //   if (viewerRef.current) {
  //     const base64 = viewerRef.current.toDataURL();
  //     console.log(base64)
  //   }
  // }

  if (!tokenData || !router.isReady) {
    return (
      <div className={s.loadingWrapper}>
        <Loading isLoaded={false}></Loading>
      </div>
    );
  }

  return (
    <ClientOnly>
      <ModelViewer
        id={'modelViewer'}
        ref={viewerRef}
        style={{
          width: '100vw',
          height: '100vh',
        }}
        src={tokenData?.thumbnail as string}
        shadow-intensity="1"
      />
    </ClientOnly>
  );
};

export default ModelCapture;
