import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useContext } from 'react';
import s from './styles.module.scss';
import { ProfileContext } from '@contexts/profile-context';
import { ITxHistory } from '@interfaces/api/bitcoin';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import cs from 'classnames';
import { toast } from 'react-hot-toast';

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const HistoryModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const { history } = useContext(ProfileContext);

  const handleClose = () => {
    onClose();
  };
  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
  };
  const renderItem = (_history: ITxHistory) => {
    return (
      <div className={s.wrapHistory} key={_history.txhash}>
        <div className={cs(s.wrapHistory_title, s.wrapHistory_content)}>
          Hash: {ellipsisCenter({ str: _history.txhash, limit: 10 })}
          <label
            className={s.wrapHistory_copy}
            onClick={() => handleCopy(_history.txhash)}
          >
            <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-copy.svg`} />
          </label>
          <label
            className={s.wrapHistory_copy}
            onClick={() =>
              window.open(
                `https://www.blockchain.com/explorer/transactions/btc/${_history.txhash}`
              )
            }
          >
            <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-share.svg`} />
          </label>
        </div>
        {!!_history.send_amount && (
          <div className={cs(s.wrapHistory_marginTop, s.wrapHistory_center)}>
            Amount: {formatBTCPrice(_history.send_amount)}
          </div>
        )}
        {!!_history.inscription_id && (
          <div className={cs(s.wrapHistory_marginTop, s.wrapHistory_center)}>
            ID: #{ellipsisCenter({ str: _history.inscription_id, limit: 10 })}{' '}
            <label
              className={s.wrapHistory_copy}
              onClick={() => handleCopy(_history.inscription_id)}
            >
              <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-copy.svg`} />
            </label>
          </div>
        )}
        {!!_history.inscription_number && (
          <div className={cs(s.wrapHistory_marginTop, s.wrapHistory_content)}>
            Inscription: #{_history.inscription_number}
          </div>
        )}
      </div>
    );
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
                <h3 className={s.modalTitle}>History</h3>
                <div className={s.formWrapper}>{history.map(renderItem)}</div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
