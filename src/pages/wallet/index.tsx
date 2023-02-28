import { CDN_URL } from '@constants/config';
import MetamaskXOrdinals from '@containers/MetamaskXOrdinals';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const MetamaskXOrdinalsPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <MetamaskXOrdinals />
      </div>
    </MarketplaceLayout>
  );
};

export default MetamaskXOrdinalsPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Wallet',
        description: 'Securely keep your Ordinal Inscriptions.',
        image: `${CDN_URL}/images/wallet-seo.jpg`,
      },
    },
  };
}
