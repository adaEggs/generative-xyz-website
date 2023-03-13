import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import { CDN_URL } from '@constants/config';
import PreserveLanding from '@containers/PreserveLanding';

const PreserveCryptoart: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <PreserveLanding />
      </div>
    </MarketplaceLayout>
  );
};

export default PreserveCryptoart;
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
