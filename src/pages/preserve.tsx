import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import Preserve from '@containers/Preserve';
import { CDN_URL } from '@constants/config';

const PreservePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Preserve />
    </MarketplaceLayout>
  );
};

export default PreservePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | CryptoArt and NFT Preservation',
        description: 'Preserve your Ethereum CryptoArt and NFTs on Bitcoin.',
        image: `${CDN_URL}/images/preserve.png`,
      },
    },
  };
}
