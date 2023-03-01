import { NextPage } from 'next';
import Marketplace from '@containers/Marketplace';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const MarketplacePage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <Marketplace />
    </MarketplaceLayout>
  );
};

export default MarketplacePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative',
        description: 'Be the first to launch and collect art on Bitcoin',
        image: `${CDN_URL}/images/image.png`,
      },
    },
  };
}
