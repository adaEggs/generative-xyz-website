import { NextPage } from 'next';
import Marketplace from '@containers/Marketplace';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const MarketplacePage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <Marketplace />
    </MarketplaceLayout>
  );
};

export default MarketplacePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collection.jpg`,
      },
    },
  };
}
