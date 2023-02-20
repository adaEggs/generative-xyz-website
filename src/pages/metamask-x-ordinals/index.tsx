import MetamaskXOrdinals from '@containers/MetamaskXOrdinals';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const MetamaskXOrdinalsPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <MetamaskXOrdinals />
    </MarketplaceLayout>
  );
};

export default MetamaskXOrdinalsPage;
