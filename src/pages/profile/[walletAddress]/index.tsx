import { DEFAULT_USER_AVATAR } from '@constants/common';
import { SEO_TITLE } from '@constants/seo-default-info';
import Profile from '@containers/Profile';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProfileByWallet } from '@services/profile';
import { GetServerSidePropsContext, NextPage } from 'next';

const ProfilePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Profile />
    </MarketplaceLayout>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { query } = context;
    const { walletAddress } = query as { walletAddress: string };

    const res = await getProfileByWallet({
      walletAddress: walletAddress.toLowerCase(),
    });

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | ${res.walletAddress || 'Profile'}`,
          description: res.bio || '',
          image: res.avatar || DEFAULT_USER_AVATAR,
        },
      },
    };
  } catch (err: unknown) {
    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | Profile`,
          image: DEFAULT_USER_AVATAR,
        },
      },
    };
  }
}
