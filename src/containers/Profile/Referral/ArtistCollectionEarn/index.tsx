import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import { Loading } from '@components/Loading';
import Table, { TColumn } from '@components/Table';
import Text from '@components/Text';
import ToogleSwitch from '@components/Toggle';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { CurrencyType } from '@enums/currency';
import { LogLevel } from '@enums/log-level';
import { ProjectVolume } from '@interfaces/project';
import { withdrawRewardEarned } from '@services/profile';
import { getProjectVolume } from '@services/project';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import useAsyncEffect from 'use-async-effect';
import s from './ArtistCollectionEarn.module.scss';

const LOG_PREFIX = 'ArtistCollectionEarn';

const ArtistCollectionEarn = () => {
  const router = useRouter();
  const { profileProjects } = useContext(ProfileContext);

  const [currencyRecord, setCurrencyRecord] = useState<CurrencyType>(
    CurrencyType.BTC
  );
  const [forceRerender, setForceRerender] = useState(0);

  const [isLoading, setisLoading] = useState(false);

  const TABLE_ARTISTS_HEADING = [
    'Collection',
    'Outputs',
    'Mint price',
    'Total volume',
    <>
      <Stack direction="horizontal" gap={2} className={s.switch_currency}>
        <ToogleSwitch
          size="16"
          checked={currencyRecord === CurrencyType.ETH}
          onChange={() => {
            if (currencyRecord === CurrencyType.ETH) {
              setCurrencyRecord(CurrencyType.BTC);
            } else {
              setCurrencyRecord(CurrencyType.ETH);
            }
          }}
        />
        <Text fontWeight="medium" color="primary-color">
          ETH
        </Text>
      </Stack>
    </>,
  ];
  const [totalVolumeList, setTotalVolumeList] = useState<ProjectVolume[]>();
  const [tableData, setTableData] = useState<TColumn[]>();

  const handleFetchTotalVolume = async (projectID: string) => {
    try {
      const response = await getProjectVolume(
        { contractAddress: GENERATIVE_PROJECT_CONTRACT, projectID },
        { payType: currencyRecord.toLowerCase() }
      );
      return response;
    } catch (err: unknown) {
      log('failed to fetch volume', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const handleWithdraw = async (amount: string, projectID: string) => {
    const payload = {
      amount: amount,
      paymentType: currencyRecord.toLowerCase(),
      id: projectID,
      type: 'project',
    };

    try {
      await withdrawRewardEarned(payload);
    } catch (err: unknown) {
      log('failed to withdraw', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  // const calculateTotalWithdraw = profileProjects?.result.reduce(
  //   (total, currentValue) => {
  //     // TODO: Update this to use the correct value
  //     return total + parseFloat(currentValue?.totalVolume || '');
  //   },
  //   0
  // );
  const recordsData = profileProjects?.result?.map(item => {
    const totalVolume = totalVolumeList?.find(
      project => project.projectID === item.tokenID
    )?.amount;

    const mintPriceEth =
      !item.mintPriceEth || item.mintPriceEth === '0'
        ? '-'
        : `${formatEthPrice(item.mintPriceEth)} ETH`;

    const mintPriceBtc =
      !item.mintPrice || item.mintPrice === '0'
        ? '-'
        : `${formatBTCPrice(item.mintPrice)} BTC`;

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
            {currencyRecord === CurrencyType.ETH ? mintPriceEth : mintPriceBtc}
          </>
        ),
        volume: (
          <>
            {!totalVolume && '-'}
            {currencyRecord === CurrencyType.ETH
              ? `${formatBTCPrice(`${totalVolume}`)} ETH`
              : `${formatBTCPrice(totalVolume || '')} BTC`}
          </>
        ),
        // earning: (
        //   <>
        //     {totalVolume === '0'
        //       ? '--'
        //       : ` ${calculateWithdrawAmount} ${currencyRecord}`}
        //   </>
        // ),
        action: (
          <div className={s.actions}>
            <ButtonIcon
              sizes="small"
              variants="outline-small"
              disabled={!Number(totalVolume)}
              onClick={() => handleWithdraw(totalVolume || '', item.tokenID)}
            >
              Withdraw
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  // useMemo(() => first, [second])

  useAsyncEffect(async () => {
    if (profileProjects?.result && profileProjects?.result.length > 0) {
      setTotalVolumeList([]);
      profileProjects?.result?.map(async item => {
        try {
          setisLoading(true);
          const response = await handleFetchTotalVolume(item.tokenID);
          if (response) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setTotalVolumeList((prev: any) => [...prev, response]);
          }
        } catch (err: unknown) {
          log('failed to fetch total volume', LogLevel.ERROR, LOG_PREFIX);
          throw Error();
        } finally {
          setisLoading(false);
        }
      });
    }
  }, [profileProjects?.result, currencyRecord]);

  useEffect(() => {
    if (totalVolumeList && totalVolumeList.length > 0) {
      setTableData(recordsData);
    }
  }, [totalVolumeList, currencyRecord, forceRerender]);

  setTimeout(() => {
    setForceRerender(1);
  }, 3000);

  if (!profileProjects?.result || profileProjects?.result.length === 0) {
    return null;
  }

  return (
    <div className={s.wrapper}>
      <Heading as="h4" fontWeight="semibold">
        Records
      </Heading>
      <div className={s.table_wrapper}>
        <Loading isLoaded={!isLoading} className={s.loading}></Loading>
        <Table
          tableHead={TABLE_ARTISTS_HEADING}
          data={tableData}
          className={s.Records_table}
        ></Table>
      </div>

      {/* {!!calculateTotalWithdraw && allMyColelctions && (
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
      )} */}
    </div>
  );
};

export default ArtistCollectionEarn;
