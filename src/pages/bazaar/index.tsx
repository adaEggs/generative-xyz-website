import BazaarWrapper from '@containers/Bazaar';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import { CDN_URL } from '@constants/config';

const BazaarPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <BazaarWrapper />
    </MarketplaceLayout>
  );
};

export default BazaarPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Collect',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
