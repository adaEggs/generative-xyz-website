import { NextPage } from 'next';
import MintBTCGenerative from '@containers/MintBTCGenerative';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const MintBTCGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <MintBTCGenerative />
    </MarketplaceLayout>
  );
};

export default MintBTCGenerativePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Upload Project',
        description:
          'Launch your NFT collection on Bitcon where it’ll last forever.',
        image: `${CDN_URL}/images/upload-project.jpg`,
      },
    },
  };
}
