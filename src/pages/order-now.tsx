import { NextPage } from 'next';

import MarketplaceLayout from '@layouts/Marketplace';
import { OrderNowTemplate } from '@containers/OrderNow';

const DisplayPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true} theme={'dark'}>
      <OrderNowTemplate />
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
