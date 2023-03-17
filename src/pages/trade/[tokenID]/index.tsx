import { GetServerSidePropsContext, NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import TokenID from '@containers/Trade/TokenID';
import { CDN_URL } from '@constants/config';
import { getOrdinalImgURL } from '@utils/inscribe';
import { getMarketplaceBtcNFTDetail } from '@services/marketplace-btc';

const TokenIDPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <TokenID />
    </MarketplaceLayout>
  );
};

export default TokenIDPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { query } = context;
    const { tokenID } = query as { tokenID: string };
    const tokenData = await getMarketplaceBtcNFTDetail(tokenID);

    return {
      props: {
        seoInfo: {
          title: `Generative | #${tokenData.inscriptionNumber}`,
          description:
            tokenData.description || 'Bitcoin NFTs. Browse. Curate. Purchase.',
          image:
            getOrdinalImgURL(tokenID) || `${CDN_URL}/images/collection.jpg`,
        },
      },
    };
  } catch (err: unknown) {
    return {
      props: {
        seoInfo: {
          title: 'Generative | Marketplace',
          description: 'Unique artwork at your fingertips to mint and buy',
          image: `${CDN_URL}/images/collection.jpg`,
        },
      },
    };
  }
}
