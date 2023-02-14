import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import Inscribe from '@containers/Inscribe';

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
        title: 'Generative | Inscribe',
        description: 'Bring your generative art to life',
        image: null,
      },
    },
  };
}
