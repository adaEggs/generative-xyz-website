import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Table, { TColumn } from '@components/Table';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { CurrencyType } from '@enums/currency';
import { LogLevel } from '@enums/log-level';
import { withdrawRewardEarned } from '@services/profile';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import s from './ArtistCollectionEarn.module.scss';
import { getProjectVolume } from '@services/project';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import useAsyncEffect from 'use-async-effect';
import { ProjectVolume } from '@interfaces/project';

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
  const [totalVolumeList, setTotalVolumeList] = useState<ProjectVolume[]>();
  const [tableData, setTableData] = useState<TColumn[]>();

  const handleFetchTotalVolume = async (projectID: string) => {
    try {
      const response = await getProjectVolume(
        { contractAddress: GENERATIVE_PROJECT_CONTRACT, projectID },
        { payType: currency.toLowerCase() }
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
      paymentType: currency.toLowerCase(),
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
            {currency === CurrencyType.ETH
              ? `${formatEthPrice(totalVolume || '')} ETH`
              : `${formatBTCPrice(totalVolume || '')} BTC`}
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
              onClick={() => handleWithdraw(totalVolume || '', item.tokenID)}
            >
              Withdraw
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  useAsyncEffect(async () => {
    if (profileProjects?.result && profileProjects?.result.length > 0) {
      const list: ProjectVolume[] = [];
      profileProjects?.result?.map(async item => {
        try {
          const response = await handleFetchTotalVolume(item.tokenID);
          if (response) {
            list.push(response);
          }
        } catch (err: unknown) {
          log('failed to fetch total volume', LogLevel.ERROR, LOG_PREFIX);
          throw Error();
        } finally {
          setTotalVolumeList(list);
        }
      });
    }
  }, [profileProjects?.result, currency]);

  useEffect(() => {
    if (totalVolumeList && totalVolumeList.length > 0) {
      setTableData(recordsData);
    }
  }, [totalVolumeList]);

  return (
    <div className={s.wrapper}>
      <Heading as="h4" fontWeight="semibold">
        Records
      </Heading>
      <Table
        tableHead={TABLE_ARTISTS_HEADING}
        data={tableData}
        className={s.Records_table}
      ></Table>
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