import { Loading } from '@components/Loading';
import { ROUTE_PATH } from '@constants/route-path';
import { LogLevel } from '@enums/log-level';
import { IGetNFTListFromMoralisParams } from '@interfaces/api/token-moralis';
import { MoralisNFT } from '@interfaces/inscribe';
import { getUserSelector } from '@redux/user/selector';
import { getNFTListFromMoralis } from '@services/token-moralis';
import { getAccessToken } from '@utils/auth';
import { isBrowser } from '@utils/common';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import InscriptionList from './InscriptionList';
import _uniqBy from 'lodash/uniqBy';
import s from './styles.module.scss';

const LOG_PREFIX = 'Authentic';

const Authentic: React.FC = (): React.ReactElement => {
  const isAuth = getAccessToken();
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const [nftList, setNftList] = useState<Array<MoralisNFT>>([]);
  // const [walletRec, setWalletRec] = useState<Record<string, string | null>>({});
  const walletRec = useRef<Record<string, string | undefined>>({});

  const handleFetchDelegatedWallets = async (): Promise<void> => {
    if (!user) {
      return;
    }
    const params: IGetNFTListFromMoralisParams = {
      limit: 1,
    };
    const res = await getNFTListFromMoralis(params);
    const wallets: Record<string, string | undefined> = {};

    for (const walletAddress in res) {
      wallets[walletAddress] = undefined;
    }

    walletRec.current = wallets;
    handleFetchNftList();
  };

  const handleFetchNftList = async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      for (const walletAddress in walletRec.current) {
        const params: IGetNFTListFromMoralisParams = {
          limit: 24,
          walletAddress,
        };
        if (walletRec.current[walletAddress]) {
          params.cursor = walletRec.current[walletAddress];
        }
        const res = await getNFTListFromMoralis(params);
        const data = res[walletAddress];
        if (data.result && Array.isArray(data.result)) {
          const newList = _uniqBy(
            [...nftList, ...data.result],
            nft => nft.token_address + nft.token_id
          );
          setNftList(newList);
        }
        walletRec.current[walletAddress] = data.cursor;
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useEffect(() => {
    handleFetchDelegatedWallets();
  }, [user]);

  const hasMore = () => {
    for (const walletAddress in walletRec.current) {
      if (walletRec.current[walletAddress]) {
        return true;
      }
    }
    return false;
  };

  if (!isAuth && isBrowser()) {
    router.push(
      `${ROUTE_PATH.AUTHENTIC_INSCRIPTIONS}?next=${ROUTE_PATH.AUTHENTIC}`
    );
    return <></>;
  }

  return (
    <div className={s.authentic}>
      <div className="container">
        <h2 className={s.sectionTitle}>
          Which Ethereum NFT do you want to preverse?
        </h2>

        <div className={s.inscriptionListWrapper}>
          <InfiniteScroll
            dataLength={nftList.length}
            next={handleFetchNftList}
            className={s.inscriptionScroller}
            hasMore={!!hasMore()}
            loader={
              <div className={s.loadingWrapper}>
                <Loading isLoaded={false} />
              </div>
            }
            endMessage={<></>}
          >
            <InscriptionList inscriptions={nftList} />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Authentic;
