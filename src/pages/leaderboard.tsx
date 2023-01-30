import { NextPage } from 'next';
import MarketplaceLayout from '@layouts/Marketplace';
import Leaderboard from '@containers/Leaderboard';

const LeaderBoardPage: NextPage = () => {
  return (
    <MarketplaceLayout isHideFaucet={true}>
      <Leaderboard />
    </MarketplaceLayout>
  );
};

export default LeaderBoardPage;
