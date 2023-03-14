import Table from '@components/Table';
import Text from '@components/Text';
import { formatBTCPrice } from '@utils/format';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';
import ButtonReceiver from '@containers/Profile/ButtonReceiver';
import ButtonSendBTC from '@containers/Profile/ButtonSendBTC';
import useBitcoin from '@bitcoin/useBitcoin';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { useContext } from 'react';
import { AssetsContext } from '@contexts/assets-context';

const BalanceTab = () => {
  const TABLE_BALANCE_HEADING = [
    'Asset',
    'Balance',
    'Pending',
    <div key="action-header" className={s.headerAction}>
      <p className={s.headerAction_text}>Action</p>
    </div>,
  ];
  const { satoshiAmount } = useBitcoin();
  const { comingAmount } = useContext(AssetsContext);
  const tableData = [
    {
      id: `$-balance`,
      render: {
        user: (
          <Stack direction="horizontal" className={s.referee}>
            <SvgInset
              size={48}
              svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
            />
            <div>
              <Text size="14" fontWeight="medium" color="black-100">
                BTC
              </Text>
              <Text size="12" fontWeight="regular" color="black-60-solid">
                Bitcoin
              </Text>
            </div>
          </Stack>
        ),
        volume: (
          <Text size="16" fontWeight="medium" color="black-100">
            {formatBTCPrice(satoshiAmount.toString())} BTC
          </Text>
        ),
        coming: (
          <Text size="16" fontWeight="medium" color="black-100">
            {formatBTCPrice(comingAmount)} BTC
          </Text>
        ),
        action: (
          <div className={s.ctas}>
            <ButtonReceiver
              sizes="small"
              className={s.receiver}
              title="Receive BTC"
            />
            <ButtonSendBTC className={s.send} sizes="small" />
          </div>
        ),
      },
    },
  ];

  return (
    <div className={s.wrapper}>
      <Text className={s.wrapper_title}>Your assets</Text>
      <Table
        tableHead={TABLE_BALANCE_HEADING}
        data={tableData}
        className={s.Refferal_table}
      />
    </div>
  );
};

export default BalanceTab;
