import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import InscriptionID from '@containers/Trade/InscriptionID';
import { CDN_URL } from '@constants/config';

const InscriptionIDPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <InscriptionID />
    </MarketplaceLayout>
  );
};

export default InscriptionIDPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Marketplace',
        description: 'Unique artwork at your fingertips to mint and buy',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
