import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React from 'react';
import s from './styles.module.scss';
import ButtonIcon from '@components/ButtonIcon';

interface IProps {
  showModal: boolean;
  onClose: () => void;

  title: string;
  desc?: string;
  onConfirm: () => void;
}

const ModalConfirm = ({
  showModal,
  onClose,
  onConfirm,
  title,
  desc,
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
              <p className={s.modalTitle}>{title}</p>
              {desc && <p className={s.modalDesc}>{desc}</p>}
              <div className={s.btnContainer}>
                <ButtonIcon
                  variants="secondary"
                  onClick={handleClose}
                  className={s.btn}
                >
                  Back
                </ButtonIcon>
                <div style={{ width: 24 }} />
                <ButtonIcon
                  variants="primary"
                  onClick={onConfirm}
                  className={s.btn}
                >
                  Confirm
                </ButtonIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
