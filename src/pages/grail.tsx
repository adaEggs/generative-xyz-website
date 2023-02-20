import { NextPage } from 'next';

import DisplayTemplate from '@containers/Display';
import MarketplaceLayout from '@layouts/Marketplace';
import { NavigationProvider } from '@contexts/navigation-context';
import { CDN_URL } from '@constants/config';

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
        image: `${CDN_URL}/images/display.jpg`,
      },
    },
  };
}
