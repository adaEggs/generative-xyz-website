import Referral from '@containers/Referral';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const ReferralPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <Referral />
    </MarketplaceLayout>
  );
};

export default ReferralPage;
