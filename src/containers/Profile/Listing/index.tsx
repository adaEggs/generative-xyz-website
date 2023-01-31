import { Loading } from '@components/Loading';
import Table from '@components/Table';
import { ProfileContext } from '@contexts/profile-context';
import { calculateFloorDifference, convertToETH } from '@utils/currency';
import { useContext } from 'react';
import s from './Listing.module.scss';
import Image from 'next/image';
import { formatTokenId, tokenID } from '@utils/format';

const TABLE_OFFERS_HEADING = ['Output', 'Price', 'Floor difference'];

export const ListingTab = (): JSX.Element => {
  const { isLoadedProfileListing, profileListing } = useContext(ProfileContext);

  const listingDatas = profileListing?.result?.map(item => {
    const { price, offeringID } = item;

    const token = item.token;
    const project = token?.project;

    return {
      id: offeringID,
      render: {
        output: (
          <div className={s.listingItem_token}>
            <Image
              src={token?.thumbnail || ''}
              alt={token?.name || ''}
              width={48}
              height={48}
            />
            <span>
              {project?.name} #{formatTokenId(tokenID(token?.name || ''))}
            </span>
          </div>
        ),
        price: convertToETH(price || ''),
        floor_differece: calculateFloorDifference(
          project?.stats?.floorPrice || '0',
          price
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
          <Loading isLoaded={isLoadedProfileListing} />
          {isLoadedProfileListing && (
            <Table
              tableHead={TABLE_OFFERS_HEADING}
              data={listingDatas || undefined}
            ></Table>
          )}
        </div>
      </div>
    </>
  );
};
