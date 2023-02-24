import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import copy from 'copy-to-clipboard';
import React, { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from './Referral.module.scss';
import Table from '@components/Table';
import { ProfileContext } from '@contexts/profile-context';
import ButtonIcon from '@components/ButtonIcon';
import Avatar from '@components/Avatar';
import { formatLongAddress } from '@utils/format';

const TABLE_REFERRALS_HEADING = ['referree', 'Total Volume', 'Action'];

const ReferralTab = () => {
  const user = useAppSelector(getUserSelector);

  const { referralListing, isLoadedProfileReferral } =
    useContext(ProfileContext);

  const referralLink = `${location.origin}${ROUTE_PATH.HOME}?referral_code=${user?.id}`;

  const referralData = referralListing?.result?.map(item => {
    return {
      id: item.referreeID,
      render: {
        user: (
          <Stack direction="horizontal" gap={3}>
            <Avatar imgSrcs={item.referree?.avatar} width={24} height={24} />
            <Text>
              {item.referree?.displayName ||
                formatLongAddress(item.referree?.walletAddress)}
            </Text>
          </Stack>
        ),
        volume: item.referree?.volume || '100 BTC',
        action: <ButtonIcon>Withdraw</ButtonIcon>,
      },
    };
  });

  return (
    <div>
      <div className={s.referral_link}>
        <Text size="18">Referral Link:</Text>
        <Stack direction="horizontal" gap={3}>
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
        </Stack>
      </div>
      {isLoadedProfileReferral && (
        <Table tableHead={TABLE_REFERRALS_HEADING} data={referralData}></Table>
      )}
    </div>
  );
};

export default ReferralTab;
