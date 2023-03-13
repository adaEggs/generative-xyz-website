import { NextPage } from 'next';
import { SWRConfig } from 'swr';

import SearchWrapper from '@containers/Search';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import { getSearchByKeyword } from '@services/search';

const SearchPage: NextPage = () => {
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
        <SearchWrapper />
      </SWRConfig>
    </MarketplaceLayout>
  );
};

export default SearchPage;

export const getServerSideProps = async () => {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Search',
        description: 'The easiest search tool for every inscription out there.',
        image: `${CDN_URL}/images/image.png`,
      },
    },
  };
};
