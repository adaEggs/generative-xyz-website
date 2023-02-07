import { CDN_URL } from '@constants/config';
import ProposalList from '@containers/DAO/ProposalList';
import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';

const DAOProposalListPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <ProposalList />
    </MarketplaceLayout>
  );
};

export default DAOProposalListPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | DAO',
        description: 'Generative | DAO',
        image: `${CDN_URL}/images/collect.jpg`,
      },
    },
  };
}
