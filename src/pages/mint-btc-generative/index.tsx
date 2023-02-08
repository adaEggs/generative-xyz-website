import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import Page404 from '@containers/404';

const MintBTCGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <Page404 />
    </MarketplaceLayout>
  );
};

export default MintBTCGenerativePage;
