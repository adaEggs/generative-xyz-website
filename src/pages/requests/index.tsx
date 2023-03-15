import { NextPage } from 'next';

import RequestWrapper from '@containers/Request';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

interface IPropsPage {
  fallback: Record<string, string> | null;
}

const RequestsPage: NextPage<IPropsPage> = ({ fallback }) => {
  return (
    <MarketplaceLayout>
      <RequestWrapper />
    </MarketplaceLayout>
  );
};

export default RequestsPage;

export const getServerSideProps = async () => {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Requests',
        description: 'All requests are there.',
        image: `${CDN_URL}/images/image.png`,
      },
    },
  };
};
