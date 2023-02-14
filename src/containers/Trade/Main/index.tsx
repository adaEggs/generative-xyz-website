import s from './Main.module.scss';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { RecentWorks } from '@containers/Trade/RecentWorks';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Heading from '@components/Heading';
import ListForSaleModal from '@containers/Trade/ListForSaleModal';
import React, { useState } from 'react';
import Collection from '@containers/Trade/Collection';

const TABS = {
  NFT: {
    id: 'nfts',
    title: 'NFTs',
  },
  COLLECTIONS: {
    id: 'collections',
    title: 'Collections',
  },
};

const MainScreen = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className={s.wrapper}>
      <Row className={s.wrapper_header}>
        <Col xs={'auto'}>
          <Heading as="h4" fontWeight="semibold">
            Marketplace
          </Heading>
        </Col>
        <Col xs={'auto'}>
          <Button
            className={s.wrapper_btn}
            size="lg"
            onClick={() => setShowModal(true)}
          >
            List for sale
          </Button>
        </Col>
      </Row>
      <Tabs className={s.tabs} defaultActiveKey={TABS.NFT.id}>
        <Tab tabClassName={s.tab} eventKey={TABS.NFT.id} title={TABS.NFT.title}>
          <div className={s.wrapper_content}>
            <RecentWorks />
          </div>
        </Tab>
        <Tab
          tabClassName={s.tab}
          eventKey={TABS.COLLECTIONS.id}
          title={TABS.COLLECTIONS.title}
        >
          <div className={s.wrapper_content}>
            <Collection />
          </div>
        </Tab>
      </Tabs>
      <ListForSaleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default MainScreen;
