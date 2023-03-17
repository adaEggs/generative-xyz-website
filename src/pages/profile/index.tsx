import { GetServerSidePropsContext, NextPage } from 'next';
import Profile from '@containers/Profile';
import MarketplaceLayout from '@layouts/Marketplace';
import { CDN_URL } from '@constants/config';
import { getProfileByWallet } from '@services/profile';
import { ROUTE_PATH } from '@constants/route-path';

const ProfilePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Profile />
    </MarketplaceLayout>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { walletAddress } = query as { walletAddress: string };

  try {
    const user = await getProfileByWallet({
      walletAddress: walletAddress.toLowerCase(),
    });

    return {
      props: {
        seoInfo: {
          title: `Generative - ${
            user.displayName || user.walletAddressBtcTaproot
          }`,
          description:
            'Be the first to launch and collect art on Bitcoin. Fully on-chain, decentralized, and immutable.',
          image: `${CDN_URL}/images/artists.png`,
        },
      },
    };
  } catch (err: unknown) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.NOT_FOUND,
      },
    };
  }
}
