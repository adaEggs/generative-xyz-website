import { NextPage } from 'next';

import MarketplaceLayout from '@layouts/Marketplace';
// import { Landingpage } from '@containers/Landingpage';
import Display from '@containers/Display';

const HomePage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true} theme={'dark'} isDisplay={true}>
      <Display />
    </MarketplaceLayout>
  );
};

export default HomePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative',
        description: 'Bring your generative art to life',
        image: null,
      },
    },
  };
}
