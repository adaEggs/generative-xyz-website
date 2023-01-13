import { NextPage } from 'next';

import DisplayTemplate from '@containers/Display';
import MarketplaceLayout from '@layouts/Marketplace';

const DisplayPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true} theme={'dark'} isDisplay={true}>
      <DisplayTemplate />
    </MarketplaceLayout>
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
