import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React from 'react';
import s from './styles.module.scss';

interface IProps {
  showModal: boolean;
  onClose: () => void;
  keySet: {
    privateKey: string;
    address: string;
    pubKey: string;
  };
}

const ExportPrivateKeyModal = ({
  showModal,
  onClose,
  keySet,
}: IProps): JSX.Element => {
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
              <>
                <h3 className={s.modalTitle}>Key</h3>
                <div className={s.keyTitle}>Private Key</div>
                <div className={s.keyContent} style={{ marginBottom: 24 }}>
                  {keySet.privateKey}
                </div>
                <div className={s.keyTitle}>Address</div>
                <div className={s.keyContent}>{keySet.address}</div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPrivateKeyModal;
