import { NextPage } from 'next';
import ClientOnly from '@components/Utils/ClientOnly';
import GLTFPreview from '@containers/ObjectPreview/GltfPreview';
import { useRouter } from 'next/router';

const GLTFPreviewPage: NextPage = () => {
  const {
    query: { url },
  } = useRouter();
  return (
    <ClientOnly>
      <GLTFPreview url={url as string} />
    </ClientOnly>
  );
};

export default GLTFPreviewPage;
