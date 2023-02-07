import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import Table from '@components/Table';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { calculateFloorDifference, convertToETH } from '@utils/currency';
import {
  formatAddress,
  formatTokenId,
  getProjectIdFromTokenId,
  tokenID,
} from '@utils/format';
import { useContext } from 'react';
import s from './Offer.module.scss';
import dayjs from 'dayjs';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';

const TABLE_OFFERS_SENT_HEADING = [
  'Output/Collections',
  'Price',
  'Floor difference',
  'Expiration',
  '',
];

const TABLE_OFFERS_RECEVIED_HEADING = [
  'Output/Collections',
  'Price',
  'Floor difference',
  'Expiration',
  'From',
  '',
];

export const OfferTab = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();

  const {
    isLoadedProfileMakeOffer,
    profileMakeOffer,
    handleCancelOffer,
    isOfferReceived,
    setIsOfferReceived,
    handleAcceptOfferReceived,
  } = useContext(ProfileContext);

  const offerDatas = profileMakeOffer?.result?.map(offer => {
    const { token } = offer;
    const project = token?.project;
    const endDate = dayjs
      .unix(Number(offer?.durationTime))
      .format('MMM DD, YYYY');

    const renderer = {
      name: (
        <div
          className={s.offer_token}
          onClick={() =>
            router.push(
              `${ROUTE_PATH.GENERATIVE}/${getProjectIdFromTokenId(
                parseInt(tokenID(token?.name || ''))
              )}/${tokenID(token?.name || '')}`
            )
          }
        >
          <span>
            {project?.name} #{formatTokenId(tokenID(token?.name || ''))}
          </span>
        </div>
      ),
      price: convertToETH(offer?.price || ''),
      floor_differece: calculateFloorDifference(
        offer?.token?.project?.stats?.floorPrice || '0',
        offer?.price
      ),
      expired_date: endDate,
    };

    if (isOfferReceived) {
      return {
        id: offer.offeringID,
        render: {
          ...renderer,
          ...{
            form:
              offer?.buyerInfo?.displayName ||
              formatAddress(offer?.buyerInfo?.walletAddress),
            accept: user?.walletAddress ===
              offer?.token?.owner?.walletAddress && (
              <div className={s.action_btn}>
                <ButtonIcon
                  sizes="small"
                  variants="outline"
                  onClick={() => handleAcceptOfferReceived(offer)}
                >
                  Accept
                </ButtonIcon>
              </div>
            ),
          },
        },
      };
    }
    return {
      id: offer.offeringID,
      render: {
        ...renderer,
        ...{
          cancel: user?.walletAddress === offer?.buyer && (
            <div className={s.action_btn}>
              <ButtonIcon
                sizes="small"
                variants="outline"
                onClick={() => handleCancelOffer(offer)}
              >
                Cancel
              </ButtonIcon>
            </div>
          ),
        },
      },
    };
  });

  return (
    <>
      <div className={s.tabContent}>
        <div className={s.filterWrapper}>
          <ButtonIcon
            variants={`${isOfferReceived ? 'primary' : 'filter'}`}
            sizes={'medium'}
            onClick={() => setIsOfferReceived(true)}
          >
            Offers received
          </ButtonIcon>
          <ButtonIcon
            variants={`${!isOfferReceived ? 'primary' : 'filter'}`}
            sizes={'medium'}
            onClick={() => setIsOfferReceived(false)}
          >
            Offers sent
          </ButtonIcon>
        </div>
        <div className={s.tokenListWrapper}>
          <Loading isLoaded={isLoadedProfileMakeOffer} />
          {isLoadedProfileMakeOffer && (
            <Table
              tableHead={
                isOfferReceived
                  ? TABLE_OFFERS_RECEVIED_HEADING
                  : TABLE_OFFERS_SENT_HEADING
              }
              data={offerDatas || undefined}
            ></Table>
          )}
        </div>
      </div>
    </>
  );
};
