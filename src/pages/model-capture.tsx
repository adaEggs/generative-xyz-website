import { NextPage } from 'next';
import dynamic from 'next/dynamic';
const ModelCapture = dynamic(() => import('@containers/ModelCapture'), {
  ssr: false,
});

const ModelCapturePage: NextPage = () => {
  return <ModelCapture />;
};

export default ModelCapturePage;
