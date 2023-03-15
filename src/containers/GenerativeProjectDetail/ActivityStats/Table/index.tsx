import Table from '@components/Table';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { formatAddress, formatBTCPrice } from '@utils/format';
import Image from 'next/image';
import { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import { v4 } from 'uuid';
import s from './Table.module.scss';

const TABLE_COLLECTION_ACTIVITIES_HEADING = [
  'Item',
  'Price',
  'Seller',
  'Buyer',
];

const CollectionActivityTable = () => {
  const { collectionActivities: listData } = useContext(
    GenerativeProjectDetailContext
  );

  // const listData = [];

  const activityDatas = listData?.result?.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction => {
      // const buyer = '{transaction.buyer}';
      // const seller = '{transaction.seller}' || '-';

      const fromAddress =
        transaction?.user_a?.displayName ||
        formatAddress(transaction?.user_a_address, 10) ||
        '-';
      const toAddress =
        transaction?.user_b?.displayName ||
        formatAddress(transaction?.user_b_address, 10) ||
        '-';

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
        id: `activity-${v4()}`,
        render: {
          item: (
            <Stack direction="horizontal" gap={2} className={`${s.token}`}>
              <Image
                src={transaction.token_info.image}
                alt={transaction.token_info.name}
                width={20}
                height={20}
              />
              #{transaction.token_info.inscriptionIndex}{' '}
            </Stack>
          ),
          price: (
            <div className={s.price}>
              {formatBTCPrice(transaction.amount)} &#8383;
            </div>
          ),
          seller: <div className={s.address}>{fromAddress}</div>,
          buyer: <div className={s.address}>{toAddress}</div>,
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
          data={activityDatas}
          className={s.collectionActivityTable}
        ></Table>
      </div>
      {/* </InfiniteScroll> */}
    </>
  );
};

export default CollectionActivityTable;
