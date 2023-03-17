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

  const renderLink = (txHash: string, explore: string) => {
    if (!txHash) return null;
    return (
      <Stack direction="horizontal" gap={3}>
        <Text size="16" fontWeight="medium" color="black-100">
          {ellipsisCenter({ str: txHash, limit: 6 })}
        </Text>
        <SvgInset
          size={18}
          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
          className={s.wrapHistory_copy}
          onClick={() => handleCopy(txHash)}
        />
        <SvgInset
          size={16}
          svgUrl={`${CDN_URL}/icons/ic-share.svg`}
          className={s.wrapHistory_copy}
          onClick={() => window.open(`${explore}/${txHash}`)}
        />
      </Stack>
    );
  };

  const tableData = (txsETH || []).map(item => {
    return {
      id: `${item.id}-history`,
      render: {
        date: (
          <>
            <Text size="16" fontWeight="medium" color="black-100">
              {item.created_at
                ? formatUnixDateTime({ dateTime: Number(item.created_at) })
                : '---'}
            </Text>
            <Stack direction="horizontal" gap={2} style={{ marginTop: 3 }}>
              <Text size="16" fontWeight="medium" color="black-100">
                ID #{ellipsisCenter({ str: item.order_id, limit: 3 })}
              </Text>
              <SvgInset
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                className={s.wrapHistory_copy}
                onClick={() => handleCopy(item.order_id)}
              />
            </Stack>
          </>
        ),
        hash: (
          <>
            <div style={{ width: 'fit-content' }}>
              {renderLink(item.buy_tx, 'https://mempool.space/tx')}
              {renderLink(item.refund_tx, 'https://etherscan.io/tx')}
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
