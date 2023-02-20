import { GetServerSidePropsContext, NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import InscriptionID from '@containers/Trade/InscriptionID';
import { CDN_URL } from '@constants/config';
import { SEO_TITLE } from '@constants/seo-default-info';
import { getOrdinalImgURL } from '@utils/inscribe';
import { getInscriptionDetail } from '@services/marketplace-btc';

const InscriptionIDPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <InscriptionID />
    </MarketplaceLayout>
  );
};

export default InscriptionIDPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
      },
    };
  }
}
