import { NextPage } from 'next';

import DisplayTemplate from '@containers/Display';
import MarketplaceLayout from '@layouts/Marketplace';
import { NavigationProvider } from '@contexts/navigation-context';

const DisplayPage: NextPage = () => {
  return (
    <NavigationProvider>
      <MarketplaceLayout isHideFaucet={true} theme={'dark'} isDisplay={true}>
        <DisplayTemplate />
      </MarketplaceLayout>
    </NavigationProvider>
  );
};

export default DisplayPage;

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
