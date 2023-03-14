import React, { useContext } from 'react';
import { AssetsContext } from '@contexts/assets-context';
import { toast } from 'react-hot-toast';
import Text from '@components/Text';
import { formatUnixDateTime } from '@utils/time';
import { Stack } from 'react-bootstrap';
import { ellipsisCenter, formatEthPrice } from '@utils/format';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from '@containers/Profile/Collected/Modal/History/styles.module.scss';
import Table from '@components/Table';

const TxsETHTab = () => {
  const { txsETH } = useContext(AssetsContext);
  const TABLE_HISTORY_HEADING = ['Date', 'Status', 'Inscription', 'Amount'];
  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.remove();
    toast.success('Copied');
  };

  const tableData = (txsETH || []).map(item => {
    return {
      id: `${item.id}-history`,
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
                {!!item.buy_tx && (
                  <Text size="16" fontWeight="medium" color="black-100">
                    {ellipsisCenter({ str: item.buy_tx, limit: 6 })}
                  </Text>
                )}
                {!!item.buy_tx && (
                  <SvgInset
                    size={18}
                    svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                    className={s.wrapHistory_copy}
                    onClick={() => handleCopy(item.buy_tx)}
                  />
                )}
                {!!item.buy_tx && (
                  <SvgInset
                    size={16}
                    svgUrl={`${CDN_URL}/icons/ic-share.svg`}
                    className={s.wrapHistory_copy}
                    onClick={() =>
                      window.open(`https://mempool.space/tx/${item.buy_tx}`)
                    }
                  />
                )}
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
            {!!item.inscription_id && (
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
            )}
          </>
        ),
        amount: (
          <>
            <Text size="16" fontWeight="medium" color="black-100">
              {item.amount_eth
                ? `${formatEthPrice(item.amount_eth)} ETH`
                : '---'}
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

export default TxsETHTab;
