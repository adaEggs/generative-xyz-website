import React, { useContext } from 'react';
import cs from 'classnames';

import Avatar from '@components/Avatar';
import Link from '@components/Link';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { User } from '@interfaces/user';
import { formatAddress } from '@utils/format';

import { QuickSearchContext } from './index';
import s from './styles.module.scss';

export const SearchMemberItem = ({
  memberName,
  avatar,
  memberId,
}: {
  memberName: string;
  avatar?: string;
  memberId: string;
}) => {
  const { onCloseSearchResult } = useContext(QuickSearchContext);

  return (
    <Link
      className={cs(
        s.searchResult_item,
        s.searchResult_item_link,
        s.searchResult_item_member
      )}
      href={`${ROUTE_PATH.PROFILE}/${memberId}`}
      onClick={onCloseSearchResult}
      isKeepDefaultEvent
    >
      <Avatar imgSrcs={avatar || ''} width={34} height={34} />
      <Text as="span" className={s.searchResult_collectionName}>
        {memberName}
      </Text>
    </Link>
  );
};

export const SearchMembersResult = ({ list }: { list: { artist: User }[] }) => {
  if (list.length === 0) return null;

  return (
    <>
      <div className={s.list_heading}>
        <Text size="12" fontWeight="medium" color="black-40-solid">
          USERS
        </Text>
      </div>
      {list.map(user => (
        <SearchMemberItem
          key={`member-${user?.artist?.id || user?.artist?.walletAddress}`}
          memberName={
            user?.artist?.displayName ||
            formatAddress(user?.artist?.walletAddress)
          }
          avatar={user?.artist?.avatar}
          memberId={user?.artist?.walletAddress}
        />
      ))}
    </>
  );
};

export default React.memo(SearchMembersResult);
