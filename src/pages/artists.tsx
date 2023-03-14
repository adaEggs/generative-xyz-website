import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import ArtistsPage from '@containers/Artists';
import { CDN_URL } from '@constants/config';

const MetamaskXOrdinalsPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <ArtistsPage />
      </div>
    </MarketplaceLayout>
  );
};

export default MetamaskXOrdinalsPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Artists',
        description:
          'Be the first to launch art on Bitcoin. Join the over 200 artists. Fully on-chain, decentralized, and immutable.',
        image: `${CDN_URL}/images/artist-3.jpg`,
      },
    },
  };
}
