import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import TokenID from '@containers/Bazaar/TokenID';
import { CDN_URL } from '@constants/config';

const TokenIDPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <TokenID />
    </MarketplaceLayout>
  );
};

export default TokenIDPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Bazaar',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
