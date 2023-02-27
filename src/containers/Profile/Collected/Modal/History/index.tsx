import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useContext } from 'react';
import s from './styles.module.scss';
import { ProfileContext } from '@contexts/profile-context';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import { toast } from 'react-hot-toast';
import Table from '@components/Table';
import Text from '@components/Text';
import { formatUnixDateTime } from '@utils/time';
import { Stack } from 'react-bootstrap';

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const HistoryModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const { history } = useContext(ProfileContext);

  const handleClose = () => {
    onClose();
  };
  const TABLE_HISTORY_HEADING = ['Date', 'Hash', 'Inscription', 'Amount'];

  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
  };

  const tableData = history.map(item => ({
    id: `${item.txhash}-history`,
    render: {
      date: (
        <Text size="16" fontWeight="medium" color="black-100">
          {item.created_at
            ? formatUnixDateTime({ dateTime: Number(item.created_at) })
            : '---'}
        </Text>
      ),
      hash: (
        <Stack direction="horizontal" gap={3}>
          <Text size="16" fontWeight="medium" color="black-100">
            {ellipsisCenter({ str: item.txhash, limit: 6 })}
          </Text>

          <SvgInset
            size={18}
            svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
            className={s.wrapHistory_copy}
            onClick={() => handleCopy(item.txhash)}
          />
          <SvgInset
            size={16}
            svgUrl={`${CDN_URL}/icons/ic-share.svg`}
            className={s.wrapHistory_copy}
            onClick={() =>
              window.open(
                `https://www.blockchain.com/explorer/transactions/btc/${item.txhash}`
              )
            }
          />
        </Stack>
      ),
      number: (
        <Text size="16" fontWeight="medium" color="black-100">
          {item.inscription_number ? `#${item.inscription_number}` : '---'}
        </Text>
      ),
      amount: (
        <Text size="16" fontWeight="medium" color="black-100">
          {item.send_amount
            ? `${formatBTCPrice(item.send_amount.toString())} BTC`
            : '---'}
        </Text>
      ),
    },
  }));

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
              <Table
                tableHead={TABLE_HISTORY_HEADING}
                data={tableData}
                className={s.historyTable}
              />
              {/*<div className={s.formWrapper}>{history.map(renderItem)}</div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
