import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React from 'react';
import s from './styles.module.scss';
import Text from '@components/Text';
import cs from 'classnames';
import { toast } from 'react-hot-toast';

export interface IExportKeySetProps {
  privateKey: string;
  address: string;
}

interface IProps {
  showModal: boolean;
  onClose: () => void;
  keySet: IExportKeySetProps;
}

const ModalExportKey = ({
  showModal,
  onClose,
  keySet,
}: IProps): JSX.Element => {
  const handleClose = () => {
    onClose();
  };

  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
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
                <div className={s.content_title}>Private Key</div>
                <div className={s.content_wrapKey}>
                  <Text className={s.content_key}>{keySet.privateKey}</Text>
                  <SvgInset
                    size={22}
                    svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                    className={s.content_copy}
                    onClick={() => handleCopy(keySet.privateKey)}
                  />
                </div>
                <div className={cs(s.content_title, s.content_titleAddress)}>
                  Address
                </div>
                <div className={s.content_wrapKey}>
                  <Text className={s.content_key}>{keySet.address}</Text>
                  <SvgInset
                    size={22}
                    svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                    className={s.content_copy}
                    onClick={() => handleCopy(keySet.address)}
                  />
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExportKey;
