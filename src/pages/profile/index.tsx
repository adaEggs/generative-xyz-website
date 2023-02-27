import { NextPage } from 'next';

import Profile from '@containers/Profile';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';

const ProfilePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Profile />
    </MarketplaceLayout>
  );
};

export default ProfilePage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative',
        description:
          'Be the first to launch art on Bitcoin. Join the over 200 artists. Fully on-chain, decentralized, and immutable.',
        image: `${CDN_URL}/images/display.jpg`,
      },
    },
  };
}
