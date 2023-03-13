import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { v4 } from 'uuid';
import { useRouter } from 'next/router';

import CategoryTab from '@components/CategoryTab';
import { LoadingProvider } from '@contexts/loading-context';
import { ROUTE_PATH } from '@constants/route-path';

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

const RequestPage = (): JSX.Element => {
  const router = useRouter();

  const [currentTabActive, setCurrentTabActive] = useState<number>(0);

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
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className={s.request_list}></div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Topic</th>
                  <th scope="col">Posted By</th>
                  <th scope="col">Comments</th>
                  <th scope="col">Activity</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={`item-${v4()}`}
                    onClick={() => {
                      router.push({
                        pathname: `${ROUTE_PATH.REQUESTS}/${index}`,
                      });
                    }}
                  >
                    <td>
                      Proposal to Develop Crypto Arbitrage Trading Application
                      Detector
                    </td>
                    <td>0x0bdf...dad2</td>
                    <td>{Math.floor(Math.random() * 100)}</td>
                    <td>Mar 22</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
