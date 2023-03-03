import MintTransaction from '@containers/Mint-Status';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const TransactionPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <MintTransaction />
    </MarketplaceLayout>
  );
};

export default TransactionPage;
