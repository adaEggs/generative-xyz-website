import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React from 'react';
import s from './styles.module.scss';
import ButtonIcon from '@components/ButtonIcon';

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const ThankModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const step = 'thank';

  const handleClose = () => {
    onClose();
  };

  if (!showModal) {
    return <></>;
  }

  return (
    <div className={s.mintBTCGenerativeModal}>
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
              {step === 'thank' && (
                <>
                  <h3 className={s.modalTitle}>Thank you for being patient.</h3>
                  <div className={s.info_guild}>
                    It might take ~an hour to completely inscribe your
                    inscription.
                  </div>
                  <div className={s.ctas}>
                    <ButtonIcon
                      type="button"
                      sizes="large"
                      className={s.buyBtn}
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Sure thing
                    </ButtonIcon>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankModal;
