import { NextPage } from 'next';
import InscribeList from '@containers/InscribeList';
import MarketplaceLayout from '@layouts/Marketplace';

const BTCGenerativePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <InscribeList />
    </MarketplaceLayout>
  );
};

export default BTCGenerativePage;
