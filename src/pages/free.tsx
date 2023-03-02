import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import Inscribe from '@containers/Inscribe';
import { CDN_URL } from '@constants/config';

const MintToolPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <Inscribe />
    </MarketplaceLayout>
  );
};

export default MintToolPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Free',
        description: 'Inscribe NFTs on Bitcoin. For free.',
        image: `${CDN_URL}/images/marketplace.jpg`,
      },
    },
  };
}
