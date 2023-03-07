import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import { Loading } from '@components/Loading';
import Table, { TColumn } from '@components/Table';
import Text from '@components/Text';
import ToogleSwitch from '@components/Toggle';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { WithdrawStatus } from '@constants/referral';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { CurrencyType } from '@enums/currency';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import { IWithdrawRefereeRewardPayload } from '@interfaces/api/profile';
import { ProjectVolume } from '@interfaces/project';
import { withdrawRewardEarned } from '@services/profile';
import { getProjectVolume } from '@services/project';
import { formatBTCPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import useAsyncEffect from 'use-async-effect';
import s from './ArtistCollectionEarn.module.scss';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';

const LOG_PREFIX = 'ArtistCollectionEarn';

const ArtistCollectionEarn = ({
  setShowModal,
}: {
  setShowModal: (_v: {
    isShow: boolean;
    data: IWithdrawRefereeRewardPayload | null;
  }) => void;
}) => {
  const router = useRouter();
  const { profileProjects } = useContext(ProfileContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currencyRecord, setCurrencyRecord] = useState<CurrencyType>(
    CurrencyType.BTC
  );
  const [forceRerender, setForceRerender] = useState(0);

  const [isLoading, setisLoading] = useState(false);

  const TABLE_ARTISTS_HEADING = [
    'Collection',
    'Outputs',
    // 'Mint price',
    'Available volume',
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
  const [totalVolumeList, setTotalVolumeList] = useState<ProjectVolume[]>([]);
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
    }
  };

  const handleWithdraw = async (amount: string, projectID: string) => {
    try {
      setIsProcessing(true);
      const payload: IWithdrawRefereeRewardPayload = {
        amount: amount,
        paymentType: currencyRecord.toLowerCase(),
        id: projectID,
        type: 'project',
      };
      await withdrawRewardEarned(payload);
      sendAAEvent({
        eventName: BTC_PROJECT.WITHDRAW,
        data: {
          ...payload,
        },
      });
      setShowModal({
        isShow: true,
        data: payload,
      });
      const response = await handleFetchTotalVolume(projectID);
      if (response) {
        const newVolumeList = totalVolumeList.map(project => {
          if (project.projectID === projectID) {
            return { ...project, ...response };
          }
          return project;
        });
        setTotalVolumeList(newVolumeList);
      }
    } catch (err: unknown) {
      log('failed to withdraw', LogLevel.ERROR, LOG_PREFIX);
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatus = (status: WithdrawStatus) => {
    switch (status) {
      case WithdrawStatus.Approve:
        return (
          <div className={cs(s.withdrawStatus, s.approved)}>
            <div className={s.sonarCircle} />
            <span>Approved</span>
          </div>
        );
      case WithdrawStatus.Pending:
        return (
          <div className={cs(s.withdrawStatus, s.pending)}>
            <div className={s.sonarCircle} />
            <span>Checking</span>
          </div>
        );
      case WithdrawStatus.Reject:
        return (
          <div className={cs(s.withdrawStatus, s.rejected)}>
            <div className={s.sonarCircle} />
            <span>Rejected</span>
          </div>
        );
      default:
        return <></>;
    }
  };

  const recordsData = profileProjects?.result?.map(item => {
    const project = totalVolumeList?.find(
      project => project.projectID === item.tokenID
    );
    const totalVolume = project?.available;
    const status = project?.status;

    // const mintPriceEth =
    //   !item.mintPriceEth || item.mintPriceEth === '0'
    //     ? '-'
    //     : `${formatEthPrice(item.mintPriceEth)} ETH`;

    // const mintPriceBtc =
    //   !item.mintPrice || item.mintPrice === '0'
    //     ? '-'
    //     : `${formatBTCPrice(item.mintPrice)} BTC`;

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
        // mintPrice: (
        //   <>
        //     {currencyRecord === CurrencyType.ETH ? mintPriceEth : mintPriceBtc}
        //   </>
        // ),
        volume: (
          <>
            {!totalVolume && '-'}
            {currencyRecord === CurrencyType.ETH
              ? `${formatBTCPrice(`${totalVolume}`)} ETH`
              : `${formatBTCPrice(totalVolume || '')} BTC`}
          </>
        ),
        action: (
          <>
            {status === WithdrawStatus.Available && (
              <div className={s.actions}>
                <ButtonIcon
                  sizes="small"
                  variants="outline-small"
                  disabled={!Number(totalVolume) || isProcessing}
                  onClick={() =>
                    handleWithdraw(totalVolume || '', item.tokenID)
                  }
                >
                  Withdraw
                </ButtonIcon>
              </div>
            )}
            {status !== undefined && status !== WithdrawStatus.Available && (
              <>{renderStatus(status)}</>
            )}
          </>
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
            setTotalVolumeList((prev: Array<ProjectVolume>) => [
              ...prev,
              response,
            ]);
          }
        } catch (err: unknown) {
          log('failed to fetch total volume', LogLevel.ERROR, LOG_PREFIX);
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
