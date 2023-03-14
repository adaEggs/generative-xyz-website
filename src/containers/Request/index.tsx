import React, { useState, useCallback, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import { v4 } from 'uuid';
import { useRouter } from 'next/router';
import Select, { SingleValue } from 'react-select';
import debounce from 'lodash/debounce';

import Button from '@components/Button';
import CategoryTab from '@components/CategoryTab';
import { LoadingProvider } from '@contexts/loading-context';
import { ROUTE_PATH } from '@constants/route-path';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';
import { ProposalStatus } from '@enums/dao';

import { WalletContext } from '@contexts/wallet-context';
import { getUserSelector } from '@redux/user/selector';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { useAppSelector } from '@redux';
// import useRequestApi, { LIMIT } from './useApi';
// import { getDaoProjects } from '@services/request';
import CollectionItems from './CollectionItems';

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
    name: 'New artists',
  },
];
const STATUS_OPTIONS: Array<{ value: number | string; label: string }> = [
  {
    value: '',
    label: 'Show all',
  },
  {
    value: ProposalStatus.Voting,
    label: 'Voting',
  },
  {
    value: ProposalStatus.Executed,
    label: 'Executed',
  },
  {
    value: ProposalStatus.Defeated,
    label: 'Defeated',
  },
];

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: 'asc',
    label: 'Sort by: Newest',
  },
  {
    value: 'desc',
    label: 'Sort by: Latest',
  },
];
const LOG_PREFIX = 'RequestsPage';

const RequestPage = (): JSX.Element => {
  const router = useRouter();
  const { connect } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);

  const [currentTabActive, setCurrentTabActive] = useState<number>(0);
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
          {currentTabActive === DAO_TYPE.COLLECTION && (
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          )}
          {currentTabActive === DAO_TYPE.ARTIST && (
            <>
              <p>
                At Generative, our goal is to create a generative art
                infrastructure that artists and collectors can rely on —
                forever.
              </p>
              <p>
                The GEN token enables shared community ownership and active
                stewardship of the Generative protocol. GEN holders govern the
                protocol through an on-chain governance process. Artists and
                collectors are no longer just users. They become co-owners and
                co-operators. They help to build and shape the Generative
                protocol.
              </p>
            </>
          )}
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
            <p>
              Artist govern Generative DAO. Artists can vote on new collection.
              A minimum of 2 artist votes is required for a new collection to be
              released on Generative.
            </p>
            <div className={s.request_filter}>
              <div className={s.request_filter_search}>
                <input
                  name="search"
                  type="text"
                  id="inputGroupFile01"
                  placeholder="collection, artists"
                  onChange={debounce(e => {
                    router.replace({
                      query: {
                        ...router.query,
                        keyword: e?.target?.value?.trim(),
                      },
                    });
                  }, 300)}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  <SvgInset
                    size={20}
                    svgUrl={`${CDN_URL}/icons/ic-search-14x14.svg`}
                  />
                </label>
              </div>
              <div>
                <Select
                  isSearchable={false}
                  isClearable={false}
                  defaultValue={STATUS_OPTIONS[0]}
                  options={STATUS_OPTIONS}
                  className={'select-input'}
                  classNamePrefix="select"
                  onChange={(op: SingleValue<SelectOption>) => {
                    if (op) {
                      router.replace({
                        query: { ...router.query, status: op.value },
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Select
                  isSearchable={false}
                  isClearable={false}
                  defaultValue={SORT_OPTIONS[0]}
                  options={SORT_OPTIONS}
                  className={'select-input'}
                  classNamePrefix="select"
                  onChange={(op: SingleValue<SelectOption>) => {
                    if (op) {
                      router.replace({
                        query: { ...router.query, sort: `_id,${op.value}` },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className={s.request_list}>
              <CollectionItems />
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
