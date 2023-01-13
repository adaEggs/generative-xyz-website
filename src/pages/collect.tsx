import { NextPage } from 'next';
import Marketplace from '@containers/Marketplace';
import MarketplaceLayout from '@layouts/Marketplace';

const MarketplacePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Marketplace />
    </MarketplaceLayout>
  );
};

export default MarketplacePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative - Collect',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: null,
      },
    },
  };
}
