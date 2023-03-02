import { NextPage, GetServerSidePropsContext } from 'next';
import { SWRConfig } from 'swr';

import SearchWrapper from '@containers/Search';
import { PAYLOAD_DEFAULT, OBJECT_TYPE } from '@containers/Search/constant';
import MarketplaceLayout from '@layouts/Marketplace';
import { SEO_DESCRIPTION, SEO_IMAGE } from '@constants/seo-default-info';
import { getSearchByKeyword, getApiKey } from '@services/search';

interface SearchPageProps {
  fallback?: Record<string, string>;
}

const SearchPage: NextPage = ({ fallback }: SearchPageProps) => {
  return (
    <MarketplaceLayout>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateIfStale: false,
          fetcher: getSearchByKeyword,
          fallback: fallback || {},
        }}
      >
        <SearchWrapper />
      </SWRConfig>
    </MarketplaceLayout>
  );
};

export default SearchPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { keyword = '' } = context.query;
  const filterBase = {
    ...PAYLOAD_DEFAULT,
    keyword,
  };
  const filterProjectParams = {
    ...filterBase,
    type: OBJECT_TYPE.PROJECT,
  };
  const filterArtistParams = {
    ...filterBase,
    type: OBJECT_TYPE.ARTIST,
  };
  const filterTokenParams = {
    ...filterBase,
    type: OBJECT_TYPE.TOKEN,
  };
  const filterInscriptionParams = {
    ...filterBase,
    type: OBJECT_TYPE.INSCRIPTION,
  };

  const [
    resultByProjects,
    resultByArtists,
    resultByTokens,
    resultByInscriptions,
  ] = await Promise.all([
    getSearchByKeyword(filterProjectParams),
    getSearchByKeyword(filterArtistParams),
    getSearchByKeyword(filterTokenParams),
    getSearchByKeyword(filterInscriptionParams),
  ]);

  return {
    props: {
      fallback: {
        [getApiKey(getSearchByKeyword, filterProjectParams)]: resultByProjects,
        [getApiKey(getSearchByKeyword, filterArtistParams)]: resultByArtists,
        [getApiKey(getSearchByKeyword, filterTokenParams)]: resultByTokens,
        [getApiKey(getSearchByKeyword, filterInscriptionParams)]:
          resultByInscriptions,
      },
      seoInfo: {
        title: 'Generative | Search',
        description: SEO_DESCRIPTION,
        image: SEO_IMAGE,
      },
    },
  };
}
