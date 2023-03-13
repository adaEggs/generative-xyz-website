import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import Airdrop from '@containers/Airdrop';
import { CDN_URL } from '@constants/config';

const AirdropPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <Airdrop />
    </MarketplaceLayout>
  );
};

export default AirdropPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | First Airdrop',
        description:
          'Launch a new collection or mint an artwork to receive the keys.',
        image: `${CDN_URL}/images/airdrop.jpg`,
      },
    },
  };
}
