import { NextPage } from 'next';
import { SWRConfig } from 'swr';

import RequestWrapper from '@containers/Request';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import { getSearchByKeyword } from '@services/search';

const RequestsPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <SWRConfig
        value={{
          keepPreviousData: true,
          revalidateOnFocus: false,
          revalidateIfStale: false,
          fetcher: getSearchByKeyword,
          fallback: {},
        }}
      >
        <RequestWrapper />
      </SWRConfig>
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
