import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import Shop from '@containers/Shop';
import { CDN_URL } from '@constants/config';

const ShopPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Shop />
    </MarketplaceLayout>
  );
};

export default ShopPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Shop',
        description:
          'Launch a new collection or mint an artwork to receive the keys.',
        image: `${CDN_URL}/images/airdrop.jpg`,
      },
    },
  };
}
