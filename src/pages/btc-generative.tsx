import { NextPage } from 'next';
import BTCGenerativeList from '@containers/BTCGenerativeList';
import MarketplaceLayout from '@layouts/Marketplace';

const BTCGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <BTCGenerativeList />
    </MarketplaceLayout>
  );
};

export default BTCGenerativePage;
