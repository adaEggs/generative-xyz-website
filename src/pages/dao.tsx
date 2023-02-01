import { NextPage } from 'next';
import Marketplace from '@containers/Marketplace';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

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
        title: 'Generative | DAO',
        description: 'Generative | DAO',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
