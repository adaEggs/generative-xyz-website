import Avatar from '@components/Avatar';
import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Table from '@components/Table';
import Text from '@components/Text';
import ToogleSwitch from '@components/Toggle';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { CurrencyType } from '@enums/currency';
import { LogLevel } from '@enums/log-level';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { withdrawRewardEarned } from '@services/profile';
import { formatBTCPrice, formatLongAddress } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import ArtistCollectionEarn from './ArtistCollectionEarn';
import s from './Referral.module.scss';

const LOG_PREFIX = 'ReferralTab';

const ReferralTab = () => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { referralListing, currency, setCurrency } = useContext(ProfileContext);

  // const [isETHCurrency, setIsETHCurrency] = useState(false);

  const TABLE_REFERRALS_HEADING = [
    'Referee',
    'Total volume',
    'Earn',
    <>
      <Stack direction="horizontal" gap={2} className={s.switch_currency}>
        <ToogleSwitch
          size="16"
          checked={currency === CurrencyType.ETH}
          onChange={() => {
            if (currency === CurrencyType.ETH) {
              setCurrency(CurrencyType.BTC);
            } else {
              setCurrency(CurrencyType.ETH);
            }
          }}
        />
        <Text fontWeight="medium" color="primary-color">
          ETH
        </Text>
      </Stack>
    </>,
  ];

  const referralLink = `${location.origin}${ROUTE_PATH.HOME}?referral_code=${user?.id}`;

  const handleWithdraw = async (amount: string, id: string) => {
    const payload = {
      amount,
      paymentType: currency.toLowerCase(),
      type: 'referal',
      id,
    };

    try {
      await withdrawRewardEarned(payload);
    } catch (err: unknown) {
      log('failed to withdraw', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const referralData = referralListing?.result?.map(item => {
    const totalVolume = item.referreeVolumn?.amount;
    const calculateWithdrawAmount = formatBTCPrice(
      Number(item.referreeVolumn.earn)
    );

    return {
      id: `${item.referreeID}-referral`,
      render: {
        user: (
          <Stack
            direction="horizontal"
            className={cs(s.referee, 'cursor-pointer')}
            onClick={() =>
              router.push(
                `${ROUTE_PATH.PROFILE}/${item.referree.walletAddress}`
              )
            }
          >
            <Avatar imgSrcs={item.referree?.avatar} width={48} height={48} />
            <Text size="14" fontWeight="medium">
              {item.referree?.displayName ||
                formatLongAddress(item.referree?.walletAddress)}
            </Text>
          </Stack>
        ),
        volume: (
          <>
            {totalVolume === '0'
              ? '--'
              : `${formatBTCPrice(totalVolume)} ${currency}`}
          </>
        ),
        earning: (
          <>
            {totalVolume === '0'
              ? '--'
              : ` ${calculateWithdrawAmount} ${currency}`}
          </>
        ),
        action: (
          <div className={s.actions}>
            <ButtonIcon
              sizes="small"
              variants="outline-small"
              disabled={!Number(calculateWithdrawAmount)}
              onClick={() =>
                handleWithdraw(item.referreeVolumn.earn || '', item.referreeID)
              }
            >
              Withdraw
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  // const calculateTotalWithdraw = referralListing?.result.reduce(
  //   (total, currentValue) => {
  //     return total + parseFloat(currentValue?.referreeVolumn?.earn || '');
  //   },
  //   0
  // );

  return (
    <div className={s.wrapper}>
      {/* <Loading isLoaded={needLoading} className={s.loading} /> */}
      <div className={s.referral_link}>
        <Heading as="h4" fontWeight="semibold">
          Referral
        </Heading>
        <Stack direction="horizontal" className="justify-between">
          <div>
            <Text size="18" fontWeight="medium">
              Refer an artist by sending your referral link to earn 1% of their
              sale volume.
            </Text>
          </div>
          <div className={s.link}>
            <Text size="18" fontWeight="medium">
              {referralLink}
            </Text>
            <SvgInset
              onClick={() => {
                copy(referralLink || '');
                toast.remove();
                toast.success('Copied');
              }}
              className={s.iconCopy}
              size={20}
              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
            />
          </div>
        </Stack>
      </div>

      <Table
        tableHead={TABLE_REFERRALS_HEADING}
        data={referralData}
        className={s.Refferal_table}
      ></Table>
      {/* {!!calculateTotalWithdraw && (
        <div className={s.Withdraw_all}>
          <ButtonIcon
            sizes="large"
            className={s.Withdraw_all_btn}
            disabled={!calculateTotalWithdraw}
            onClick={() => handleWithdraw(`${calculateTotalWithdraw}`)}
          >
            <span>Withdraw all</span>
            <>
              <span className={s.dots}></span>
              <span>
                {currency === CurrencyType.ETH
                  ? formatEthPrice(`${calculateTotalWithdraw}`)
                  : formatBTCPrice(calculateTotalWithdraw)}
                {currency}
              </span>
            </>
          </ButtonIcon>
        </div>
      )} */}
      <ArtistCollectionEarn />
    </div>
  );
};

export default ReferralTab;
