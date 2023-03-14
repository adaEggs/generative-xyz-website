import { GetServerSidePropsContext, NextPage } from 'next';
import { SWRConfig } from 'swr';

import MarketplaceLayout from '@layouts/Marketplace';
import InscriptionID from '@containers/Trade/InscriptionID';
import { CDN_URL } from '@constants/config';
import { SEO_TITLE } from '@constants/seo-default-info';
import { getOrdinalImgURL } from '@utils/inscribe';
import { getInscriptionDetail } from '@services/marketplace-btc';
import { getApiKey } from '@utils/swr';

interface IPropsPage {
  fallback: Record<string, string> | null;
}

const InscriptionIDPage: NextPage<IPropsPage> = ({ fallback }) => {
  return (
    <MarketplaceLayout>
      <SWRConfig
        value={{
          revalidateOnFocus: true,
          revalidateIfStale: false,
          fetcher: getInscriptionDetail,
          fallback: fallback || {},
        }}
      >
        <InscriptionID />
      </SWRConfig>
    </MarketplaceLayout>
  );
};

export default InscriptionIDPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { query } = context;
    const { tokenID } = query as { tokenID: string };
    const tokenData = await getInscriptionDetail(tokenID);

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | #${tokenData.inscriptionNumber}`,
          description:
            tokenData.description ?? 'Bitcoin NFTs. Browse. Curate. Purchase.',
          image:
            getOrdinalImgURL(tokenID) || `${CDN_URL}/images/collection.jpg`,
        },
        fallback: {
          [getApiKey(getInscriptionDetail, tokenID)]: tokenData,
        },
      },
    };
  } catch (err) {
    return {
      props: {
        seoInfo: {
          title: 'Generative | Inscriptions',
          description: 'Bitcoin NFTs. Browse. Curate. Purchase.',
          image: `${CDN_URL}/images/collection.jpg`,
        },
        fallback: {},
      },
    };
  }
};
