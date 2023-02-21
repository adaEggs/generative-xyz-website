import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import PageDeep from '@containers/Deep';

const ErrorPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <PageDeep />
    </MarketplaceLayout>
  );
};

export default ErrorPage;
