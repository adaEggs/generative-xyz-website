import { NextPage } from 'next';
import ClientOnly from '@components/Utils/ClientOnly';
import GLTFPreview from '@containers/ObjectPreview/GltfPreview';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('@components/ModelViewer'), {
  ssr: false,
});

const GLTFPreviewPage: NextPage = () => {
  const {
    isReady,
    query: { url, defaultUrl, viewOnly, whiteHouse },
  } = useRouter();

  const modelUrl = useMemo(() => {
    if (url) {
      return url;
    }
    if (defaultUrl === 'true') {
      return '/models/default-sweet-candy.glb';
    }
  }, [url, defaultUrl]);

  if (isReady) {
    if (viewOnly === 'true') {
      return (
        <ClientOnly>
          <ModelViewer
            style={{
              width: '100vw',
              height: '100vh',
            }}
            src={modelUrl as string}
            shadow-intensity="1"
            camera-controls
          />
        </ClientOnly>
      );
    }

    return (
      <ClientOnly>
        <GLTFPreview
          whiteHouse={whiteHouse === 'true'}
          url={modelUrl as string}
        />
      </ClientOnly>
    );
  }
  return <></>;
};

export default GLTFPreviewPage;
