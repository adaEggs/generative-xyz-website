import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React from 'react';
import s from './styles.module.scss';
import { Tab, Tabs } from 'react-bootstrap';
import TxsTab from '@containers/Profile/Collected/Modal/History/TxsTab';
import TxsETHTab from '@containers/Profile/Collected/Modal/History/TxsETHTab';
import TxsPurchaseTab from '@containers/Profile/Collected/Modal/History/TxsPurchaseTab';

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const HistoryModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const handleClose = () => {
    onClose();
  };

  if (!showModal) {
    return <></>;
  }

  return (
    <div className={s.container}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={handleClose}
                className={s.closeBtn}
                variants="ghost"
                type="button"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              <h3 className={s.modalTitle}>History</h3>
              <Tabs className={s.tabs} defaultActiveKey="txs">
                <Tab tabClassName={s.tab} eventKey="txs" title="Others">
                  <TxsTab />
                </Tab>
                <Tab
                  tabClassName={s.tab}
                  eventKey="txsETH"
                  title="Buy inscriptions with ETH"
                >
                  <TxsETHTab />
                </Tab>
                <Tab tabClassName={s.tab} eventKey="txsPurchase" title="Sales">
                  <TxsPurchaseTab />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
