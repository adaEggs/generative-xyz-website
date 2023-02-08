import { NextPage } from 'next';
import BTCGenerativeList from '@containers/BTCGenerativeList';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const BTCGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <BTCGenerativeList />
    </MarketplaceLayout>
  );
};

export default BTCGenerativePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Collect BTC NFT',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
