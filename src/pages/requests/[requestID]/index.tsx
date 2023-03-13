import { GetServerSidePropsContext, NextPage } from 'next';
import { SWRConfig } from 'swr';

import RequestDetailWrapper from '@containers/Request/Detail';
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
        <RequestDetailWrapper />
      </SWRConfig>
    </MarketplaceLayout>
  );
};

export default RequestsPage;

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { requestID = '' } = query;

  return {
    props: {
      seoInfo: {
        title: 'Generative | Request Detail',
        description: 'Detail a request is here.',
        image: `${CDN_URL}/images/image.png`,
      },
    },
  };
};
