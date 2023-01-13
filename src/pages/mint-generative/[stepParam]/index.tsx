import { NextPage } from 'next';
import MintGenerative from '@containers/MintGenerative';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const MintGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <MintGenerative />
    </MarketplaceLayout>
  );
};

export default MintGenerativePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Upload Project',
        description:
          'Launch your NFT collection on the chain where it’ll last forever.',
        image: `${CDN_URL}/images/upload.jpg`,
      },
    },
  };
}
