import s from './styles.module.scss';
import { ShopTab } from '@enums/shop';
import React, { useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Image from 'next/image';
import Collection from './Collection';
import { CDN_URL } from '@constants/config';
import Button from '@components/ButtonIcon';
import ListCollectionModal from './ListCollectionModal';

const ShopController: React.FC = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<ShopTab>(ShopTab.COLLECTION);
  const [showListCollectionModal, setShowListCollectionModal] = useState(false);

  const handleSelectTab = (tab: ShopTab): void => {
    setActiveTab(tab);
  };

  const handleOpenListCollectionModal = (): void => {
    setShowListCollectionModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseListCollectionModal = (): void => {
    setShowListCollectionModal(false);
    document.body.style.overflow = 'auto';
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
    <>
      <div className={s.shopController}>
        <div className="container">
          <div className={s.headingWrapper}>
            <h1 className={s.heading}>
              Buy art on Bitcoin. Simple. Fast. Zero fees.
            </h1>
            <div className={s.actionWrapper}>
              <Button onClick={handleOpenListCollectionModal}>
                <Image
                  className={s.tabIcon}
                  src={`${CDN_URL}/icons/ic-image-white-18x18.svg`}
                  width={18}
                  height={18}
                  alt="ic collection"
                />
                List a collection
              </Button>
            </div>
          </div>
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
      {showListCollectionModal && (
        <ListCollectionModal handleClose={handleCloseListCollectionModal} />
      )}
    </>
  );
};

export default ShopController;
