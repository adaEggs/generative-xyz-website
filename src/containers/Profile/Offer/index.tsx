import ButtonIcon from '@components/ButtonIcon';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import Table from '@components/Table';
import { ROUTE_PATH } from '@constants/route-path';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { calculateFloorDifference, convertToETH } from '@utils/currency';
import { formatAddress } from '@utils/format';
import { useContext } from 'react';
import s from './Owned.module.scss';

const TABLE_OFFERS_HEADING = [
  'Price',
  'Floor difference',
  // 'Expiration',
  'From',
  '',
];

export const OfferTab = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const { isLoadedProfileMakeOffer, profileMakeOffer } =
    useContext(ProfileContext);

  const offerDatas = profileMakeOffer?.result?.map(offer => {
    return {
      id: offer.offeringID,
      render: {
        price: convertToETH(offer?.price || ''),
        floor_differece: calculateFloorDifference(
          offer?.token?.project?.stats?.floorPrice || '0',
          offer?.price
        ),
        // expired_date: offer?.durationTime,
        buyer:
          user?.walletAddress === offer?.buyer ? (
            <Link href={ROUTE_PATH.PROFILE}>You</Link>
          ) : (
            <Link href={ROUTE_PATH.PROFILE}>
              {formatAddress(offer?.buyer || '')}
            </Link>
          ),
        cancel: user?.walletAddress === offer?.buyer && (
          <div className={s.action_btn}>
            <ButtonIcon sizes="small" variants="outline">
              Cancel
            </ButtonIcon>
          </div>
        ),
      },
    };
  });

  return (
    <>
      <div className={s.tabContent}>
        <div className={s.filterWrapper}>
          {/* <TokenTopFilter
            keyword=""
            sort=""
            onKeyWordChange={() => {
              //
            }}
            onSortChange={() => {
              //
            }}
          /> */}
        </div>
        <div className={s.tokenListWrapper}>
          <Loading isLoaded={isLoadedProfileMakeOffer} />
          {isLoadedProfileMakeOffer && (
            <Table
              tableHead={TABLE_OFFERS_HEADING}
              data={offerDatas || undefined}
            ></Table>
          )}
        </div>
      </div>
    </>
  );
};
