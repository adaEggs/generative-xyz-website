import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import { CDN_URL } from '@constants/config';
import AuthenticLanding from '@containers/AuthenticLanding';

const MetamaskXOrdinalsPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <AuthenticLanding />
      </div>
    </MarketplaceLayout>
  );
};

export default MetamaskXOrdinalsPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Authentic',
        description: 'Inscribe your original Ethereum NFTs onto Bitcoin',
        image: `${CDN_URL}/images/authentic-poster.png`,
      },
    },
  };
}
