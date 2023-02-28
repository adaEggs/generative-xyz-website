import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Table from '@components/Table';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { CurrencyType } from '@enums/currency';
import { LogLevel } from '@enums/log-level';
import { withdrawRefereeReward } from '@services/profile';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import s from './ArtistCollectionEarn.module.scss';

const LOG_PREFIX = 'ArtistCollectionEarn';

const ArtistCollectionEarn = () => {
  const router = useRouter();
  const { profileProjects, currency } = useContext(ProfileContext);
  const TABLE_ARTISTS_HEADING = [
    'Collection',
    'Outputs',
    'Mint price',
    'Total volume',
    '',
    // <>
    //   <Stack direction="horizontal" gap={2} className={s.switch_currency}>
    //     <ToogleSwitch
    //       size="16"
    //       checked={currency === CurrencyType.ETH}
    //       onChange={() => {
    //         if (currency === CurrencyType.ETH) {
    //           setCurrency(CurrencyType.BTC);
    //         } else {
    //           setCurrency(CurrencyType.ETH);
    //         }
    //       }}
    //     />
    //     <Text fontWeight="medium" color="primary-color">
    //       ETH
    //     </Text>
    //   </Stack>
    // </>,
  ];

  // const handleFetchTotalVolume = async (projectID: string) => {
  //   try {
  //     const response = await getProjectVolume(
  //       { contractAddress: GENERATIVE_PROJECT_CONTRACT, projectID },
  //       { payType: currency.toLowerCase() }
  //     );
  //     return response;
  //   } catch (err: unknown) {
  //     log('failed to fetch volume', LogLevel.ERROR, LOG_PREFIX);
  //     throw Error();
  //   }
  // };

  const handleWithdraw = async (amount: string, projectID: string[]) => {
    const payload = {
      items: [
        {
          amount: amount,
          projectID: projectID,
          paymentType: currency.toLowerCase(),
        },
      ],
    };

    try {
      await withdrawRefereeReward(payload);
    } catch (err: unknown) {
      log('failed to withdraw', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const calculateTotalWithdraw = profileProjects?.result.reduce(
    (total, currentValue) => {
      // TODO: Update this to use the correct value
      return total + parseFloat(currentValue?.totalVolume || '');
    },
    0
  );

  const allMyColelctions = profileProjects?.result?.map(item => {
    return item.tokenID;
  });

  const recordsData = profileProjects?.result?.map(item => {
    const totalVolume = '1000000';

    return {
      id: `${item.id}-record`,
      render: {
        collection: (
          <Stack
            direction="horizontal"
            className={cs(s.collection, 'cursor-pointer')}
            onClick={() =>
              router.push(`${ROUTE_PATH.GENERATIVE}/${item.tokenID}`)
            }
          >
            <div className={s.searchResult_collectionThumbnail}>
              <Image src={item.image} alt={item.name} width={34} height={34} />
            </div>
            <Text size="14" fontWeight="medium">
              {item?.name}
            </Text>
          </Stack>
        ),
        output: (
          <>
            {item.mintingInfo.index}/{item.maxSupply}
          </>
        ),
        mintPrice: (
          <>
            {currency === CurrencyType.ETH
              ? `${formatEthPrice(item.mintPriceEth)} ETH`
              : `${formatBTCPrice(item.mintPrice)} BTC`}
          </>
        ),
        volume: (
          <>
            {totalVolume ? '--' : `${formatBTCPrice(totalVolume)} ${currency}`}
          </>
        ),
        // earning: (
        //   <>
        //     {totalVolume === '0'
        //       ? '--'
        //       : ` ${calculateWithdrawAmount} ${currency}`}
        //   </>
        // ),
        action: (
          <div className={s.actions}>
            <ButtonIcon
              sizes="small"
              variants="outline-small"
              disabled={!Number(totalVolume)}
              // onClick={() => handleWithdraw(totalVolume || '', [item.tokenID])}
            >
              Withdraw
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  return (
    <div className={s.wrapper}>
      <Heading as="h4" fontWeight="semibold">
        Records
      </Heading>
      <Table
        tableHead={TABLE_ARTISTS_HEADING}
        data={recordsData}
        className={s.Records_table}
      ></Table>
      {!!calculateTotalWithdraw && allMyColelctions && (
        <div className={s.Withdraw_all}>
          <ButtonIcon
            sizes="large"
            className={s.Withdraw_all_btn}
            disabled={!calculateTotalWithdraw}
            onClick={() =>
              handleWithdraw(`${calculateTotalWithdraw}`, allMyColelctions)
            }
          >
            <span>Withdraw all</span>
            <>
              <span className={s.dots}></span>
              <span>{formatBTCPrice(calculateTotalWithdraw)} BTC</span>
            </>
          </ButtonIcon>
        </div>
      )}
    </div>
  );
};

export default ArtistCollectionEarn;
