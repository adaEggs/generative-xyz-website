import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import CreateProposal from '@containers/DAO/CreateProposal';

const DAOCreateProposalPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <CreateProposal />
    </MarketplaceLayout>
  );
};

export default DAOCreateProposalPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Create Proposal',
        description:
          'Collectively contribute to the development of the Generative protocol',
        image: `${CDN_URL}/images/collection.jpg`,
      },
    },
  };
}
