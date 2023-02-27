import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useContext } from 'react';
import s from './styles.module.scss';
import { ProfileContext } from '@contexts/profile-context';
import { Modal } from 'react-bootstrap';
import Text from '@components/Text';
import QRCodeGenerator from '@components/QRCodeGenerator';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface IProps {
  isShow: boolean;
  onHideModal: () => void;
}

const ModalReceiver = ({ isShow, onHideModal }: IProps): JSX.Element => {
  const { currentUser } = useContext(ProfileContext);

  return (
    <Modal className={s.modalWrapper} centered show={isShow}>
      <Modal.Header className={s.modalHeader}>
        <Button
          onClick={onHideModal}
          className={s.modalHeader_closeBtn}
          variants="ghost"
        >
          <SvgInset
            className={s.closeIcon}
            svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
          />
        </Button>
        <Text className={s.modalHeader_title} size="20">
          Receiver
        </Text>
      </Modal.Header>
      <Modal.Body>
        <div className={s.qrCodeWrapper}>
          <QRCodeGenerator
            className={s.qrCodeGenerator}
            size={160}
            value={currentUser?.walletAddressBtcTaproot || ''}
          />
          <div className={s.wrapAddress}>
            <p className={s.address}>
              {currentUser?.walletAddressBtcTaproot || ''}
            </p>
            <SvgInset
              size={18}
              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
              className={s.iconCopy}
              onClick={() => {
                copy(currentUser?.walletAddressBtcTaproot || '');
                toast.remove();
                toast.success('Copied');
              }}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalReceiver;
