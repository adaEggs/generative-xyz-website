import { NextPage } from 'next';

import MarketplaceLayout from '@layouts/Marketplace';
// import { Landingpage } from '@containers/Landingpage';
import Display from '@containers/Display';
import { NavigationProvider } from '@contexts/navigation-context';

const HomePage: NextPage = () => {
  return (
    <NavigationProvider>
      <MarketplaceLayout isHideFaucet={true} theme={'dark'} isDisplay={true}>
        <Display />
      </MarketplaceLayout>
    </NavigationProvider>
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
