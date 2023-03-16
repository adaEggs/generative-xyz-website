import Link from '@components/Link';
import Table from '@components/Table';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { TokenActivityType } from '@enums/token-type';
import { formatAddressDisplayName, formatBTCPrice } from '@utils/format';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import s from './Table.module.scss';

const TABLE_COLLECTION_ACTIVITIES_HEADING = [
  'Item',
  'Price',
  'Seller',
  'Buyer',
  'Event',
];

const CollectionActivityTable = () => {
  const { collectionActivities: listData, projectData } = useContext(
    GenerativeProjectDetailContext
  );

  const router = useRouter();

  const { projectID } = router.query;

  // const listData = [];

  const activityDatas = listData?.result?.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (transaction, index) => {
      // const buyer = '{transaction.buyer}';
      // const seller = '{transaction.seller}' || '-';

      const fromAddress =
        transaction?.user_a?.displayName || transaction?.user_a_address || '-';
      const toAddress =
        transaction?.user_b?.displayName || transaction?.user_b_address || '-';

      //   if (index + 1 === transactionList.length) {
      //     // Last transaction is first "Mint"
      //     return {
      //       id: transaction.tx_hash,
      //       render: {
      //         event: (
      //           <div className={s.event}>
      //             <SvgInset svgUrl={`${CDN_URL}/icons/ic-stars.svg`} />
      //             Mint
      //           </div>
      //         ),
      //         price:
      //           transaction.value === '0' ? '-' : convertToETH(transaction.value),
      //         form_address: formatAddress(fromAddress),
      //         to_address: formatAddress(toAddress),
      //         updated_at: (
      //           <Stack direction="horizontal" gap={3}>
      //             {updatedAt}
      //             <Link
      //               href={`${scanURL}/tx/${transaction.tx_hash}`}
      //               target="_blank"
      //             >
      //               <SvgInset svgUrl={`${CDN_URL}/icons/ic-link.svg`} />
      //             </Link>
      //           </Stack>
      //         ),
      //       },
      //     };
      //   }

      return {
        id: `activity-${projectData?.tokenID}-${index}`,
        render: {
          item: (
            <Stack
              direction="horizontal"
              gap={2}
              className={`${s.token} cursor-pointer`}
              onClick={() =>
                router.push({
                  pathname: `${ROUTE_PATH.GENERATIVE}/${projectID}/${transaction.token_info.tokenID}`,
                })
              }
            >
              <Image
                src={transaction.token_info.image}
                alt={transaction.token_info.name}
                width={20}
                height={20}
              />
              #
              {transaction.token_info.orderInscriptionIndex ||
                transaction.token_info.inscriptionIndex ||
                ''}{' '}
            </Stack>
          ),
          price: (
            <div className={s.price}>
              {formatBTCPrice(transaction.amount)} BTC
            </div>
          ),
          seller: (
            <div className={s.address}>
              <Link
                href={`${ROUTE_PATH.PROFILE}/${
                  transaction?.user_a?.walletAddressBtcTaproot
                    ? transaction?.user_a?.walletAddressBtcTaproot
                    : transaction?.user_a?.walletAddress
                }`}
                className="hover-underline"
              >
                {formatAddressDisplayName(fromAddress)}
              </Link>
            </div>
          ),
          buyer: (
            <div className={s.address}>
              <Link
                href={`${ROUTE_PATH.PROFILE}/${
                  transaction?.user_b?.walletAddressBtcTaproot
                    ? transaction?.user_b?.walletAddressBtcTaproot
                    : transaction?.user_b?.walletAddress
                }`}
                className="hover-underline"
              >
                {formatAddressDisplayName(toAddress)}
              </Link>
            </div>
          ),
          event: (
            <div className={s.event}>{TokenActivityType[transaction.type]}</div>
          ),
        },
      };
    }
  );

  // if (!listData) return <NotFound infoText="No activity yet" />;

  return (
    <>
      {/* <InfiniteScroll
        dataLength={listData?.result.length || 0}
        next={() => {}}
        className={s.activitiesScroller}
        hasMore
        loader={
          <div className={s.loadingWrapper}>
            <Loading isLoaded={true} />
          </div>
        }
        endMessage={<></>}
      > */}
      {/* <InscriptionList inscriptions={nftList} /> */}
      <div className={s.wrapper}>
        <Table
          tableHead={TABLE_COLLECTION_ACTIVITIES_HEADING}
          data={
            listData?.result && listData?.result.length > 0 ? activityDatas : []
          }
          className={s.collectionActivityTable}
        />
      </div>
      {/* </InfiniteScroll> */}
    </>
  );
};

export default CollectionActivityTable;
