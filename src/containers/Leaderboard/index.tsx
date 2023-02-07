import { AnimFade } from '@animations/fade';
import Avatar from '@components/Avatar';
import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Table from '@components/Table';
import Text from '@components/Text';
import { APP_TOKEN_SYMBOL, CDN_URL } from '@constants/config';
import {
  GEN_TOKEN_ADDRESS,
  IGNORABLE_GEN_HOLDER_ADDRESS_LIST,
} from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { LoadingProvider } from '@contexts/loading-context';
import { NFTHolder } from '@interfaces/nft';
import { getNFTHolderList } from '@services/nfts';
import { formatCurrency, formatLongAddress } from '@utils/format';
import Image from 'next/image';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import Web3 from 'web3';
import s from './styles.module.scss';

const TABLE_LEADERBOARD_HEADING = [
  'Rank',
  'Nickname',
  ' ',
  `${APP_TOKEN_SYMBOL} Balance`,
  'Collections',
  'Outputs Minted',
];

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

  const renderBadges = (position: number) => {
    switch (position) {
      case 0:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={38}
            svgUrl={`${CDN_URL}/icons/ic-badge-gold.svg`}
          />
        );
      case 1:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={38}
            svgUrl={`${CDN_URL}/icons/ic-badge-silver.svg`}
          />
        );
      case 2:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={38}
            svgUrl={`${CDN_URL}/icons/ic-badge-bronze.svg`}
          />
        );

      default:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={38}
            svgUrl={`${CDN_URL}/icons/ic-badge-iron.svg`}
          />
        );
    }
  };

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
            <Avatar imgSrcs={item?.profile?.avatar || ''} />
            <Link
              className={s.displayName}
              href={`${ROUTE_PATH.PROFILE}/${item.address}`}
            >
              <Text as="span" size="14" fontWeight="medium">
                {displayName}
              </Text>
            </Link>
          </div>
        ),
        trophy: <div className={s.badgesCol}>{renderBadges(index)}</div>,
        balance: <div className={s.dataCol}> {item.balance} </div>,
        colletions: (
          <div className={s.dataCol}>
            {' '}
            {item.profile?.stats?.collection_created || '-'}{' '}
          </div>
        ),
        minted: (
          <div className={s.dataCol}>
            {' '}
            {item.profile?.stats?.nft_minted || '-'}{' '}
          </div>
        ),
      },
    };
  });

  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <div className={s.leaderboard}>
        <div className="container">
          <div className={s.pageHeader}>
            <Heading
              as="h2"
              className={s.pageTitle}
              fontWeight="medium"
              animOption={{ screen: 0.1, offset: 0, type: 'heading' }}
            >
              Testnet Leaderboard
            </Heading>
            <div className={s.pageDescription}>
              <Text animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}>
                The fellows below have shown tremendous passion for generative
                art by promoting the movement and making significant
                contributions to the community.
              </Text>
              <Text animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}>
                Earn {APP_TOKEN_SYMBOL} and start climbing the ladder today!
              </Text>
              <AnimFade screen={0.4}>
                <ButtonIcon className={s.testnetBtn}>
                  <Link href={ROUTE_PATH.INCENTIVIZED_TESTNET}>
                    Join testnet
                  </Link>
                </ButtonIcon>
              </AnimFade>
            </div>
          </div>
          <AnimFade screen={0.5}>
            <div className={s.pageBody}>
              {/* <Loading isLoaded={!isLoading} /> */}
              {!isLoading && (
                <>
                  {userList.length === 0 && (
                    <div className={s.emptyDataWrapper}>
                      <Image
                        className={s.emptyImage}
                        width={74}
                        height={100}
                        src={`${CDN_URL} / icons / ic - empty.svg`}
                        alt="empty.svg"
                      />
                      <Text className={s.emptyText}>
                        {errorMessage ? errorMessage : 'No available data'}
                      </Text>
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
          </AnimFade>
        </div>
      </div>
    </LoadingProvider>
  );
};

export default Leaderboard;
