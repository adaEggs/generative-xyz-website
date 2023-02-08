import BTCGenerativeDetail from '@containers/BTCGenerativeDetail';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const GenerativeTokenDetailPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <BTCGenerativeDetail />
    </MarketplaceLayout>
  );
};

export default GenerativeTokenDetailPage;
