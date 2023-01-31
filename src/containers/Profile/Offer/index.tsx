import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import Table from '@components/Table';
import { ProfileContext } from '@contexts/profile-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { calculateFloorDifference, convertToETH } from '@utils/currency';
import { formatTokenId, tokenID } from '@utils/format';
import { useContext } from 'react';
import s from './Offer.module.scss';
import dayjs from 'dayjs';

const TABLE_OFFERS_SENT_HEADING = [
  'Output/Collections',
  'Price',
  'Floor difference',
  'Expiration',
  '',
];

export const OfferTab = (): JSX.Element => {
  const user = useAppSelector(getUserSelector);
  // const [filterOffer, setFillterOffer] = useState<string>('sent');
  const { isLoadedProfileMakeOffer, profileMakeOffer, handleCancelOffer } =
    useContext(ProfileContext);

  const offerDatas = profileMakeOffer?.result?.map(offer => {
    const { token } = offer;
    const project = token?.project;
    const endDate = dayjs
      .unix(Number(offer?.durationTime))
      .format('MMM DD, YYYY');
    return {
      id: offer.offeringID,
      render: {
        name: `${project?.name} #${formatTokenId(tokenID(token?.name || ''))}`,
        price: convertToETH(offer?.price || ''),
        floor_differece: calculateFloorDifference(
          offer?.token?.project?.stats?.floorPrice || '0',
          offer?.price
        ),
        expired_date: endDate,
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
    };
  });

  return (
    <>
      <div className={s.tabContent}>
        <div className={s.filterWrapper}>
          {/*<ButtonIcon*/}
          {/*  variants={`${filterOffer === 'received' ? 'primary' : 'filter'}`}*/}
          {/*  sizes={'medium'}*/}
          {/*>*/}
          {/*  Offers received*/}
          {/*</ButtonIcon>*/}
          {/*<ButtonIcon*/}
          {/*  variants={`${filterOffer === 'sent' ? 'primary' : 'filter'}`}*/}
          {/*  sizes={'medium'}*/}
          {/*>*/}
          {/*  Offers sent*/}
          {/*</ButtonIcon>*/}
        </div>
        <div className={s.tokenListWrapper}>
          <Loading isLoaded={isLoadedProfileMakeOffer} />
          {isLoadedProfileMakeOffer && (
            <Table
              tableHead={TABLE_OFFERS_SENT_HEADING}
              data={offerDatas || undefined}
            ></Table>
          )}
        </div>
      </div>
    </>
  );
};
