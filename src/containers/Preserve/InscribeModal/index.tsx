import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Inscribe from '@containers/Inscribe';
import React from 'react';
import cs from 'classnames';
import s from './styles.module.scss';

interface IProps {
  handleClose: () => void;
}

const InscribeModal: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { handleClose } = props;

  return (
    <div className={s.inscribeModal}>
      <div className={s.backdrop}>
        <div className="container">
          <div className={cs(s.modalWrapper)}>
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
              <Inscribe isModal setUploadedFile={() => null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribeModal;
