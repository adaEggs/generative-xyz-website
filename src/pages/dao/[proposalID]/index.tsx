import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import ProposalDetail from '@containers/DAO/ProposalDetail';

const DAOProposalDetailPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <ProposalDetail />
    </MarketplaceLayout>
  );
};

export default DAOProposalDetailPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | DAO',
        description: 'Generative | DAO',
        image: `${CDN_URL}/images/collection.jpg`,
      },
    },
  };
}
