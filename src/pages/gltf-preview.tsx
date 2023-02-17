import { NextPage } from 'next';
import ClientOnly from '@components/Utils/ClientOnly';
import GLTFPreview from '@containers/ObjectPreview/GltfPreview';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const GLTFPreviewPage: NextPage = () => {
  const {
    query: { url, defaultUrl },
  } = useRouter();

  const modelUrl = useMemo(() => {
    if (url) {
      return url;
    }
    if (defaultUrl === 'true') {
      return '/models/default-sweet-candy.glb';
    }
  }, [url, defaultUrl]);

  return (
    <ClientOnly>
      <GLTFPreview url={modelUrl as string} />
    </ClientOnly>
  );
};

export default GLTFPreviewPage;
