import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import MintTool from '@containers/MintTool';

const MintToolPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <MintTool />
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
