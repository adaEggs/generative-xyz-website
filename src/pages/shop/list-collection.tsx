import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import ListCollection from '@containers/ListCollection';
import { CDN_URL } from '@constants/config';

const ListCollectionPage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <ListCollection />
    </MarketplaceLayout>
  );
};

export default ListCollectionPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | List A Collection',
        description: 'It’s easy, fast, with zero platform fees.',
        image: `${CDN_URL}/images/image.jpg`,
      },
    },
  };
}
