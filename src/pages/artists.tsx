import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import ArtistsPage from '@containers/Artists';

const MetamaskXOrdinalsPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <ArtistsPage />
      </div>
    </MarketplaceLayout>
  );
};

export default MetamaskXOrdinalsPage;
