import { NextPage } from 'next';
import { SWRConfig } from 'swr';

import RequestWrapper from '@containers/Request';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import { getDaoProjects } from '@services/request';
// import { LIMIT } from '@containers/Request/useApi';
// import { getApiKey } from '@utils/swr';

interface IPropsPage {
  fallback: Record<string, string> | null;
}

const RequestsPage: NextPage<IPropsPage> = ({ fallback }) => {
  return (
    <MarketplaceLayout>
      <SWRConfig
        value={{
          keepPreviousData: true,
          revalidateOnFocus: false,
          revalidateIfStale: false,
          fetcher: getDaoProjects,
          fallback: fallback || {},
        }}
      >
        <RequestWrapper />
      </SWRConfig>
    </MarketplaceLayout>
  );
};

export default RequestsPage;

export const getServerSideProps = async () => {
  // const params = { limit: LIMIT };
  // const collections = await getDaoProjects(params);

  return {
    props: {
      fallback: {
        // [getApiKey(getDaoProjects, params)]: collections,
      },
      seoInfo: {
        title: 'Generative | Requests',
        description: 'All requests are there.',
        image: `${CDN_URL}/images/image.png`,
      },
    },
  };
};
