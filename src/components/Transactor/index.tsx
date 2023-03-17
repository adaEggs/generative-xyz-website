import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import { Modal } from 'react-bootstrap';
import Text from '@components/Text';
import React, { PropsWithChildren } from 'react';
import cs from 'classnames';

type Type = 'normal' | 'expand';

export interface IBaseModalProps {
  isShow: boolean;
  onHide: () => void;
  title: string;
  className?: string;
  type?: Type;
}

const BaseModal = (props: PropsWithChildren<IBaseModalProps>): JSX.Element => {
  const { isShow, onHide, title, children, className } = props;
  return (
    <Modal className={cs(s.modalWrapper, className)} centered show={isShow}>
      <Modal.Header className={s.modalHeader}>
        <Button
          onClick={onHide}
          className={s.modalHeader_closeBtn}
          variants="ghost"
        >
          <SvgInset
            className={s.closeIcon}
            svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
          />
        </Button>
        <Text className={s.modalHeader_title} size="20">
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default BaseModal;
