import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import React from 'react';
import { Modal } from 'react-bootstrap';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import Heading from '@components/Heading';
import Text from '@components/Text';
import Link from '@components/Link';
import { SOCIALS } from '@constants/common';

type Props = {
  isShow: boolean;
  onHideModal: () => void;
};

const WithdrawModal = ({ isShow, onHideModal }: Props) => {
  return (
    <div className={s.withdrawModal}>
      <Modal
        show={isShow}
        onHide={onHideModal}
        centered
        className={s.modalWrapper}
      >
        <Modal.Header className={s.modalHeader}>
          <ButtonIcon
            onClick={onHideModal}
            className={s.closeBtn}
            variants="ghost"
          >
            <SvgInset
              className={s.closeIcon}
              svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
            />
          </ButtonIcon>
        </Modal.Header>
        <Modal.Body>
          <Heading as="h5">Your withdrawal is submitted successfully.</Heading>
          <br></br>
          <Text size="18">
            It might take up to a business day for Generative to process your
            withdrawal. Please be patient in the meantime. <br /> Should you
            need any further support, join our{' '}
            <Link href={SOCIALS.discord} className="hover-underline">
              Discord.
            </Link>
          </Text>
          <br />
          <div className="divider"></div>
          <div className={s.actionWrapper}>
            <ButtonIcon
              onClick={onHideModal}
              className={s.actionBtn}
              variants="secondary"
            >
              I understand
            </ButtonIcon>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WithdrawModal;
