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
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import InscriptionList from './InscriptionList';
import s from './styles.module.scss';

const LOG_PREFIX = 'Authentic';

const Authentic: React.FC = (): React.ReactElement => {
  const isAuth = getAccessToken();
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const [cursor, setCursor] = useState('');
  const [nftList, setNftList] = useState<Array<MoralisNFT>>([]);

  const handleFetchNftList = async (): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      const params: IGetNFTListFromMoralisParams = {
        walletAddress: user.walletAddress,
        limit: 12,
      };
      if (cursor) {
        params.cursor = cursor;
      }
      const res = await getNFTListFromMoralis(params);
      const data = res[user.walletAddress];
      if (data.result && Array.isArray(data.result)) {
        setNftList(prev => [...prev, ...data.result]);
      }
      setCursor(data.cursor);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useEffect(() => {
    handleFetchNftList();
  }, [user]);

  if (!isAuth && isBrowser()) {
    router.push(`${ROUTE_PATH.WALLET}?next=${ROUTE_PATH.AUTHENTIC}`);
    return <></>;
  }

  return (
    <div className={s.authentic}>
      <div className="container">
        <h2 className={s.sectionTitle}>
          Choose an Ethereum NFT to inscribe onto Bitcoin
        </h2>

        <div className={s.inscriptionListWrapper}>
          <InfiniteScroll
            dataLength={nftList.length}
            next={handleFetchNftList}
            className={s.inscriptionScroller}
            hasMore={!!cursor}
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
