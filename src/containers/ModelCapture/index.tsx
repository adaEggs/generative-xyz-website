import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { LogLevel } from '@enums/log-level';
import { Token } from '@interfaces/token';
import { createTokenThumbnail, getTokenUri } from '@services/token-uri';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import ModelViewer from '@components/ModelViewer';

const LOG_PREFIX = 'ModelCapture';

const ModelCapture: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const { projectID, tokenID } = router.query as {
    projectID: string;
    tokenID: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  const [tokenData, setTokenData] = useState<Token | null>(null);

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

  const handleScreenshotModel = (): void => {
    const base64Image = viewerRef.current.toDataURL();
    createTokenThumbnail({
      tokenID: tokenID,
      thumbnail: base64Image,
    });
  };

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.addEventListener('load', handleScreenshotModel);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener('load', handleScreenshotModel);
      }
    };
  }, [tokenData]);

  return (
    <ClientOnly>
      <ModelViewer
        id={'modelViewer'}
        ref={viewerRef}
        style={{
          width: '512px',
          height: '512px',
          background: '#ffffff',
        }}
        src={tokenData?.thumbnail as string}
        shadow-intensity="1"
      />
    </ClientOnly>
  );
};

export default ModelCapture;
