import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import WrapperIncentivizedTestnet from '@containers/IncentivizedTestnet';

const ErrorPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <WrapperIncentivizedTestnet />
    </MarketplaceLayout>
  );
};

export default ErrorPage;
