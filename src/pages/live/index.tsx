import TradeWrapper from '@containers/Trade/Live';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import { CDN_URL } from '@constants/config';

const TradePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <TradeWrapper />
    </MarketplaceLayout>
  );
};

export default TradePage;

export async function getServerSideProps() {
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
