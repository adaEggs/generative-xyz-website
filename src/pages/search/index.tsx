import { NextPage } from 'next';

import SearchWrapper from '@containers/Search';
import MarketplaceLayout from '@layouts/Marketplace';
import { SEO_DESCRIPTION, SEO_IMAGE } from '@constants/seo-default-info';

const SearchPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <SearchWrapper />
    </MarketplaceLayout>
  );
};

export default SearchPage;

export async function getServerSideProps({ query }) {
  // const { keyword = '' } = query;

  return {
    props: {
      seoInfo: {
        title: 'Generative | Search',
        description: SEO_DESCRIPTION,
        image: SEO_IMAGE,
      },
    },
  };
}
