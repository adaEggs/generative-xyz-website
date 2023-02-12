import TradeWrapper from '@containers/Trade';
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
        title: 'Generative | Trade',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
