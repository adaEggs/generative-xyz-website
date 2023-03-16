import React, { useEffect, useState, useContext, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/router';

import CategoryTab from '@components/CategoryTab';
import { LoadingProvider } from '@contexts/loading-context';
import { ROUTE_PATH } from '@constants/route-path';
// import { CDN_URL } from '@constants/config';
// import SvgInset from '@components/SvgInset';
import Button from '@components/Button';

import { WalletContext } from '@contexts/wallet-context';
import { getUserSelector } from '@redux/user/selector';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { useAppSelector } from '@redux';

import CollectionItems from './CollectionItems';
import Filter from './Filter';

import s from './Request.module.scss';

const DAO_TYPE = {
  COLLECTION: 0,
  ARTIST: 1,
};
const CATEGORY = [
  {
    id: DAO_TYPE.COLLECTION,
    name: 'New Collections',
  },
  {
    id: DAO_TYPE.ARTIST,
    name: 'New Artists',
  },
];
const UserItems = dynamic(() => import('./UserItems'), {
  ssr: false,
});

const LOG_PREFIX = 'DAOPage';

const RequestPage = (): JSX.Element => {
  const router = useRouter();
  const { tab = 0 } = router.query;
  const { connect } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);

  const [currentTabActive, setCurrentTabActive] = useState<number>(0);

  useEffect(() => {
    if (tab == DAO_TYPE.COLLECTION) {
      setCurrentTabActive(DAO_TYPE.COLLECTION);
    } else if (tab == DAO_TYPE.ARTIST) {
      setCurrentTabActive(DAO_TYPE.ARTIST);
    }
  }, [tab]);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
      router.push(ROUTE_PATH.CREATE_BTC_PROJECT);
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const onClickToUpload = useCallback(async () => {
    if (user) {
      router.push(ROUTE_PATH.CREATE_BTC_PROJECT);
    } else {
      handleConnectWallet();
    }
  }, [user]);

  return (
    <div className={s.request}>
      <Container>
        <h1 className={s.request_title}>Generative DAO</h1>
        <div className={s.request_description}>
          <p>
            Co-owned and co-operated by the community to empower artists.
            Support the art movement on Bitcoin together!
          </p>
        </div>
        <Row>
          <Col md={12}>
            <div className={s.request_control}>
              <div className={s.request_category}>
                {CATEGORY.map(item => (
                  <CategoryTab
                    type="3"
                    text={item.name}
                    key={item.id}
                    onClick={() => {
                      setCurrentTabActive(item.id);
                      router.replace({
                        query: {
                          tab: item.id,
                        },
                      });
                    }}
                    active={currentTabActive === item.id}
                    loading={false}
                  />
                ))}
              </div>
              <div className={s.request_submit}>
                <div className={s.request_submit_text}>
                  {user
                    ? 'It’s free and simple to release art on Bitcon.'
                    : 'Connect wallet to submit a collection.'}
                </div>
                <Button
                  className={s.request_submit_btn}
                  onClick={onClickToUpload}
                >
                  {isConnecting ? 'Connecting...' : 'Submit a collection'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className={s.request_textNote}>
              <p>
                Artists govern Generative DAO. Artists can vote on new
                collections. A minimum of 2 artist votes is required for a new
                collection to be released on Generative.
              </p>
            </div>
            <Filter currentTabActive={currentTabActive} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className={s.request_list}>
              {currentTabActive === DAO_TYPE.COLLECTION ? (
                <CollectionItems />
              ) : (
                <UserItems />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const WrapperRequest = (): JSX.Element => {
  return (
    <LoadingProvider
      simple={{
        theme: 'light',
        isCssLoading: false,
      }}
    >
      <RequestPage />
    </LoadingProvider>
  );
};

export default WrapperRequest;
