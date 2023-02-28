import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import Authentic from '@containers/Authentic';
import { CDN_URL } from '@constants/config';

const AuthenticPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Authentic />
    </MarketplaceLayout>
  );
};

export default AuthenticPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Authentic',
        description: 'Inscribe NFTs on Bitcoin. For free.',
        image: `${CDN_URL}/images/marketplace.jpg`,
      },
    },
  };
}
