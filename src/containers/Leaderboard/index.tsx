import s from './styles.module.scss';
import { NFTHolder } from '@interfaces/nft';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Loading } from '@components/Loading';
import { CDN_URL } from '@constants/config';
import Table from '@components/Table';
import Image from 'next/image';
import { formatCurrency, formatLongAddress } from '@utils/format';
import { getNFTHolderList } from '@services/nfts';
import Web3 from 'web3';
import {
  GEN_TOKEN_ADDRESS,
  IGNORABLE_GEN_HOLDER_ADDRESS_LIST,
} from '@constants/contract-address';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';

const TABLE_LEADERBOARD_HEADING = ['Rank', 'Artist', 'GEN Balance'];

const Leaderboard: React.FC = (): React.ReactElement => {
  const [userList, setUserList] = useState<Array<NFTHolder>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useAsyncEffect(async () => {
    try {
      const { result } = await getNFTHolderList({
        contractAddress: GEN_TOKEN_ADDRESS,
        page: 1,
        limit: 100,
      });
      const formattedData = result
        .filter(
          item => !IGNORABLE_GEN_HOLDER_ADDRESS_LIST.includes(item.address)
        )
        .map(item => {
          return {
            ...item,
            profile: item.profile,
            balance: formatCurrency(
              parseFloat(Web3.utils.fromWei(item.balance))
            ),
          };
        });
      setUserList(formattedData);
    } catch (err: unknown) {
      setErrorMessage('Failed to fetch leaderboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tableData = userList.map((item, index) => {
    const displayName = item.profile?.display_name
      ? item.profile.display_name
      : formatLongAddress(item.address);
    return {
      id: index.toString(),
      render: {
        rank: index + 1,
        walletAddress: (
          <div className={s.artistCol}>
            {index === 0 && (
              <Image
                className={s.trophyIcon}
                alt="trophy gold"
                width={20}
                height={20}
                src={`${CDN_URL}/icons/ic-trophy-gold-20x20.svg`}
              />
            )}
            {index === 1 && (
              <Image
                className={s.trophyIcon}
                alt="trophy silver"
                width={20}
                height={20}
                src={`${CDN_URL}/icons/ic-trophy-silver-20x20.svg`}
              />
            )}
            {index === 2 && (
              <Image
                className={s.trophyIcon}
                alt="trophy bronze"
                width={20}
                height={20}
                src={`${CDN_URL}/icons/ic-trophy-bronze-20x20.svg`}
              />
            )}
            <Link
              className={s.displayName}
              href={`${ROUTE_PATH.PROFILE}/${item.address}`}
            >
              {displayName}
            </Link>
          </div>
        ),
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
                <Table
                  className={s.dataTable}
                  tableHead={TABLE_LEADERBOARD_HEADING}
                  data={tableData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
