import s from './styles.module.scss';
import { UserLeaderBoard } from '@interfaces/leaderboard';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Loading } from '@components/Loading';
import { CDN_URL } from '@constants/config';
import Table from '@components/Table';
import Image from 'next/image';
import { formatLongAddress } from '@utils/format';

const TABLE_LEADERBOARD_HEADING = ['Rank', 'Artist', 'GEN Balance'];

const Leaderboard: React.FC = (): React.ReactElement => {
  const [userList, setUserList] = useState<Array<UserLeaderBoard>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useAsyncEffect(async () => {
    try {
      // const { items } = await getLeaderboardUserList();
      // const leaderboardData = items.map((item) => {
      //   return {
      //     walletAddress: item.address,
      //     balance: Web3.utils.fromWei(item.balance),
      //   }
      // })
      setUserList([
        {
          walletAddress: '0xBc785D855012105820Be6D8fFA7f644062a91bcA',
          balance: '100.02',
        },
        {
          walletAddress: '0xBc785D855012105820Be6D8fFA7f644062a91bcA',
          balance: '100.02',
        },
      ]);
    } catch (err: unknown) {
      setErrorMessage('Failed to fetch leaderboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tableData = userList.map((item, index) => {
    return {
      id: index.toString(),
      render: {
        rank: index + 1,
        walletAddress: formatLongAddress(item.walletAddress),
        balance: item.balance,
      },
    };
  });

  return (
    <div className={s.leaderboard}>
      <div className="container">
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Leaderboards</h1>
          <h2 className={s.pageDescription}>
            The artists featured below have shown tremendous passion for
            generative art, promoted the movement of generative art, and made
            significant contributions to the community.
          </h2>
        </div>
        <div className={s.pageBody}>
          <Loading isLoaded={!isLoading} />
          {!isLoading && (
            <>
              {userList.length === 0 && (
                <div className={s.emptyDataWrapper}>
                  <Image
                    className={s.emptyImage}
                    width={74}
                    height={100}
                    src={`${CDN_URL}/icons/ic-empty.svg`}
                    alt="empty.svg"
                  />
                  <p className={s.emptyText}>
                    {errorMessage ? errorMessage : 'No available data'}
                  </p>
                </div>
              )}
              {userList.length > 0 && (
                <Table tableHead={TABLE_LEADERBOARD_HEADING} data={tableData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
