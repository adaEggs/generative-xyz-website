import { NextPage } from 'next';

import MarketplaceLayout from '@layouts/Marketplace';
import Benefit from '@containers/Benefit';
import { CDN_URL } from '@constants/config';

const BenefitTemplate: NextPage = () => {
  return (
    <MarketplaceLayout theme={'dark'}>
      <Benefit />
    </MarketplaceLayout>
  );
};

export default BenefitTemplate;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Create',
        description:
          'An open and permissionless platform for artists to create and monetize their work',
        image: `${CDN_URL}/images/create.jpg`,
      },
    },
  };
}
