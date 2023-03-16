import Link from '@components/Link';
import NotFound from '@components/NotFound';
import Table from '@components/Table';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeTokenDetailContext } from '@contexts/generative-token-detail-context';
import { TokenActivityType } from '@enums/token-type';
import { formatAddress, formatBTCPrice } from '@utils/format';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';

const TABLE_ACTIVITIES_HEADING = ['Event', 'Price', 'From', 'To', 'Date'];

enum eventIcon {
  'ic-mint.svg',
  'ic-tag.svg',
  'ic-x-circle.svg',
  'ic-sale.svg',
}

const TableActivities = () => {
  const { tokenActivities } = useContext(GenerativeTokenDetailContext);
  // const scanURL = getScanUrl();

  if (!tokenActivities?.result) return <NotFound infoText="No activity yet" />;

  const activityDatas = tokenActivities?.result.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (transaction, index) => {
      const updatedAt = transaction?.time
        ? dayjs(transaction?.time).format('MMM DD, YYYY')
        : '-';

      const fromAddress =
        transaction.user_a?.displayName ||
        formatAddress(transaction?.user_a_address, 10) ||
        '-';
      const toAddress =
        transaction?.user_b?.displayName ||
        formatAddress(transaction?.user_b_address, 10) ||
        '-';

      // if (index + 1 === transactionList.length) {
      //   // Last transaction is first "Mint"
      //   return {
      //     id: transaction.tx_hash,
      //     render: {
      //       event: (
      //         <div className={s.event}>
      //           <SvgInset svgUrl={`${CDN_URL}/icons/ic-stars.svg`} />
      //           Mint
      //         </div>
      //       ),
      //       price:
      //         transaction.value === '0' ? '-' : convertToETH(transaction.value),
      //       form_address: formatAddress(fromAddress),
      //       to_address: formatAddress(toAddress),
      //       updated_at: (
      //         <Stack direction="horizontal" gap={3}>
      //           {updatedAt}
      //           <Link
      //             href={`${scanURL}/tx/${transaction.tx_hash}`}
      //             target="_blank"
      //           >
      //             <SvgInset svgUrl={`${CDN_URL}/icons/ic-link.svg`} />
      //           </Link>
      //         </Stack>
      //       ),
      //     },
      //   };
      // }
      return {
        id: `activity-${index}`,
        render: {
          event: (
            <div className={s.event}>
              <SvgInset
                size={16}
                svgUrl={`${CDN_URL}/icons/${eventIcon[transaction?.type]}`}
              />
              {TokenActivityType[transaction?.type]}
            </div>
          ),
          price: <>{formatBTCPrice(transaction?.amount)} BTC</>,
          form_address: (
            <Link
              href={`${ROUTE_PATH.PROFILE}/${
                transaction?.user_a?.walletAddressBtcTaproot
                  ? transaction?.user_a?.walletAddressBtcTaproot
                  : transaction?.user_a?.walletAddress
              }`}
              className="hover-underline"
            >
              {fromAddress}
            </Link>
          ),

          to_address: (
            <Link
              href={`${ROUTE_PATH.PROFILE}/${
                transaction?.user_b?.walletAddressBtcTaproot
                  ? transaction?.user_b?.walletAddressBtcTaproot
                  : transaction?.user_b?.walletAddress
              }`}
              className="hover-underline"
            >
              {toAddress}
            </Link>
          ),
          updated_at: (
            <Stack direction="horizontal" gap={3}>
              {updatedAt}
              {/* <Link
                href={`${scanURL}/tx/${transaction.tx_hash}`}
                target="_blank"
              >
                <SvgInset svgUrl={`${CDN_URL}/icons/ic-link.svg`} />
              </Link> */}
            </Stack>
          ),
        },
      };
    }
  );

  return (
    <Table tableHead={TABLE_ACTIVITIES_HEADING} data={activityDatas}></Table>
  );
};

export default TableActivities;
