import { CDN_URL } from '@constants/config';
import Developer from '@containers/Developer';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const DeveloperPage: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'} isHideFaucet={true}>
      <div style={{ width: '100%', backgroundColor: '#1c1c1c' }}>
        <Developer />
      </div>
    </MarketplaceLayout>
  );
};

export default DeveloperPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Developers',
        description: '',
        image: `${CDN_URL}/images/wallet-seo.jpg`,
      },
    },
  };
}
