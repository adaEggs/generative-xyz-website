import s from './styles.module.scss';
import { ShopTab } from '@enums/shop';
import React, { useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Image from 'next/image';
import Collection from './Collection';
import { CDN_URL } from '@constants/config';

const ShopController: React.FC = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<ShopTab>(ShopTab.COLLECTION);

  const handleSelectTab = (tab: ShopTab): void => {
    setActiveTab(tab);
  };

  const renderCollectionTitle = useMemo(
    (): React.ReactElement => (
      <div className={s.tabTitle}>
        <Image
          className={s.tabIcon}
          src={`${CDN_URL}/icons/ic-collection-18x18.svg`}
          width={18}
          height={18}
          alt="ic collection"
        />
        <h2 className={s.tabName}>Collections</h2>
      </div>
    ),
    []
  );

  return (
    <div className={s.shopController}>
      <div className="container">
        <h1 className={s.heading}>
          Buy art on Bitcoin. Simple. Fast. Zero fees.
        </h1>
        <Tabs
          className={s.tabs}
          activeKey={activeTab}
          onSelect={tab => handleSelectTab(tab as ShopTab)}
        >
          <Tab
            tabClassName={s.tab}
            eventKey={ShopTab.COLLECTION}
            title={renderCollectionTitle}
          >
            <div className={s.collectionTab}>
              <Collection />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopController;
