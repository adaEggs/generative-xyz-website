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
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { formatBTCPrice, formatLongAddress } from '@utils/format';
import copy from 'copy-to-clipboard';
import { useContext, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from './Referral.module.scss';
// import ToogleSwitch from '@components/Toggle';

const ReferralTab = () => {
  const user = useAppSelector(getUserSelector);

  const { referralListing, isLoadedProfileReferral } =
    useContext(ProfileContext);

  const [isETHCurrency, setIsCurrency] = useState(false);

  const TABLE_REFERRALS_HEADING = [
    'Referee',
    'Total volume',
    'Earn',
    <>
      <Stack direction="horizontal" gap={2} className={s.switch_currency}>
        <ToogleSwitch
          size="16"
          checked={isETHCurrency}
          onChange={() => setIsCurrency(!isETHCurrency)}
        />
        <Text fontWeight="medium" color="primary-color">
          ETH
        </Text>
      </Stack>
    </>,
  ];

  const referralLink = `${location.origin}${ROUTE_PATH.HOME}?referral_code=${user?.id}`;

  const referralData = referralListing?.result?.map(item => {
    const withdrawAmount = '10000000'; // 0.1 BTC
    const calculateWithdrawAmount = formatBTCPrice(
      Number(withdrawAmount) / 100
    );

    return {
      id: `${item.referreeID}-referral`,
      render: {
        user: (
          <Stack direction="horizontal" className={s.referee}>
            <Avatar imgSrcs={item.referree?.avatar} width={48} height={48} />
            <Text size="14" fontWeight="medium">
              {item.referree?.displayName ||
                formatLongAddress(item.referree?.walletAddress)}
            </Text>
          </Stack>
        ),
        volume: (
          <>
            {formatBTCPrice(item.referree?.volume || withdrawAmount)}{' '}
            {isETHCurrency ? 'ETH' : 'BTC'}
          </>
        ),
        earning: (
          <>
            {calculateWithdrawAmount} {isETHCurrency ? 'ETH' : 'BTC'}
          </>
        ),
        action: (
          <div className={s.actions}>
            <ButtonIcon
              sizes="small"
              variants="outline-small"
              disabled={!withdrawAmount}
            >
              Withdraw
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  const calculateTotalWithdraw = useMemo(() => {
    return 0;
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.referral_link}>
        <Stack direction="horizontal" className="justify-between">
          <Heading as="h4" fontWeight="bold">
            Referral List:
          </Heading>
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
      {isLoadedProfileReferral && (
        <>
          <Table
            tableHead={TABLE_REFERRALS_HEADING}
            data={referralData}
            className={s.Refferal_table}
          ></Table>
          <div className={s.Withdraw_all}>
            <ButtonIcon
              sizes="large"
              className={s.Withdraw_all_btn}
              disabled={!calculateTotalWithdraw}
            >
              <span>Withdraw all</span>
              {!!calculateTotalWithdraw && (
                <>
                  <span className={s.dots}></span>
                  <span>{calculateTotalWithdraw} BTC</span>
                </>
              )}
            </ButtonIcon>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralTab;
