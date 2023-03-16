import React, { useContext } from 'react';
import { AssetsContext } from '@contexts/assets-context';
import { toast } from 'react-hot-toast';
import { TrackTxType } from '@interfaces/api/bitcoin';
import Text from '@components/Text';
import { formatUnixDateTime } from '@utils/time';
import { Stack } from 'react-bootstrap';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from '@containers/Profile/Collected/Modal/History/styles.module.scss';
import Table from '@components/Table';

const TxsTab = () => {
  const { history } = useContext(AssetsContext);
  const TABLE_HISTORY_HEADING = ['Date', 'Hash', 'Inscription', 'Amount'];
  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
  };

  const mapTxType = (type: TrackTxType) => {
    switch (type) {
      case TrackTxType.normal:
        return 'Send BTC';
      case TrackTxType.inscription:
        return 'Send inscription';
      case TrackTxType.list:
        return 'List for sale';
      case TrackTxType.buyInscription:
        return 'Buy inscription';
      case TrackTxType.cancel:
        return 'Cancel listing';
    }
  };

  const tableData = (history || [])
    .filter(
      item =>
        item.type !== TrackTxType.buySplit &&
        item.type !== TrackTxType.listSplit &&
        item.type !== TrackTxType.cancel
    )
    .map(item => {
      return {
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
            <>
              <div style={{ width: 'fit-content' }}>
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
                      window.open(`https://mempool.space/tx/${item.txhash}`)
                    }
                  />
                </Stack>
                <Text
                  size="16"
                  fontWeight="medium"
                  style={{ color: item.statusColor }}
                >
                  {item.status}
                </Text>
              </div>
            </>
          ),
          number: (
            <>
              {!!item.inscription_id && !!item.inscription_number ? (
                <div>
                  <Stack direction="horizontal" gap={3}>
                    <Text size="16" fontWeight="medium" color="black-100">
                      {`${ellipsisCenter({
                        str: item.inscription_id,
                        limit: 6,
                      })}`}
                    </Text>
                    <SvgInset
                      size={18}
                      svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                      className={s.wrapHistory_copy}
                      onClick={() => handleCopy(item.inscription_id)}
                    />
                    <SvgInset
                      size={16}
                      svgUrl={`${CDN_URL}/icons/ic-share.svg`}
                      className={s.wrapHistory_copy}
                      onClick={() =>
                        window.open(
                          `https://ordinals.com/inscription/${item.inscription_id}`
                        )
                      }
                    />
                  </Stack>
                  <Text size="16" fontWeight="medium" color="black-100">
                    {`#${item.inscription_number}`}
                  </Text>
                </div>
              ) : (
                <Text size="16" fontWeight="medium" color="black-100">
                  ---
                </Text>
              )}
            </>
          ),
          amount: (
            <>
              <Text size="16" fontWeight="medium" color="black-100">
                {item.send_amount
                  ? `${formatBTCPrice(item.send_amount.toString())} BTC`
                  : '---'}
              </Text>
              <Text size="16" fontWeight="medium" color="black-100">
                {mapTxType(item.type)}
              </Text>
            </>
          ),
        },
      };
    });
  return (
    <Table
      tableHead={TABLE_HISTORY_HEADING}
      data={tableData}
      className={s.historyTable}
    />
  );
};

export default TxsTab;
