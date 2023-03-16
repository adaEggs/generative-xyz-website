import { NextPage } from 'next';

import RequestWrapper from '@containers/Request';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const RequestsPage: NextPage = () => {
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
        title: 'Generative | DAO',
        description:
          'Co-owned and co-operated by the community to empower artists.',
        image: `${CDN_URL}/images/dao.jpg`,
      },
    },
  };
};
