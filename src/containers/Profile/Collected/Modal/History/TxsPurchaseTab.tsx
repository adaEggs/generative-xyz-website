import React, { useContext } from 'react';
import { AssetsContext } from '@contexts/assets-context';
import { toast } from 'react-hot-toast';
import Text from '@components/Text';
import { formatUnixDateTime } from '@utils/time';
import { Stack } from 'react-bootstrap';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from '@containers/Profile/Collected/Modal/History/styles.module.scss';
import Table from '@components/Table';

const TxsPurchaseTab = () => {
  const { txsPurchase } = useContext(AssetsContext);
  const TABLE_HISTORY_HEADING = ['Date', 'Status', 'Inscription', 'Amount'];
  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
  };

  const tableData = (txsPurchase || []).map(item => {
    return {
      id: `${item.order_id}-${item.timestamp}-history`,
      render: {
        date: (
          <Text size="16" fontWeight="medium" color="black-100">
            {item.timestamp
              ? formatUnixDateTime({ dateTime: Number(item.timestamp) })
              : '---'}
          </Text>
        ),
        hash: (
          <>
            <div style={{ width: 'fit-content' }}>
              {!!item.txhash && (
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
              )}
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
            {item.inscription_id ? (
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
              </div>
            ) : (
              <Text size="16" fontWeight="medium" color="black-100">
                ---
              </Text>
            )}
          </>
        ),
        amount: (
          <Text size="16" fontWeight="medium" color="black-100">
            {item.amount
              ? `${formatBTCPrice(item.amount.toString())} BTC`
              : '---'}
          </Text>
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

export default TxsPurchaseTab;
