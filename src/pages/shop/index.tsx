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
          'Buy art on Bitcoin. It’s easy, fast, with zero platform fees.',
        image: `${CDN_URL}/images/image.jpg`,
      },
    },
  };
}
