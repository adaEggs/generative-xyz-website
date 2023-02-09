import { useMemo } from 'react';
import s from './CreatorInfo.module.scss';
import { User } from '@interfaces/user';
import Avatar from '@components/Avatar';
import { convertIpfsToHttp } from '@utils/image';
import { formatAddress } from '@utils/format';

interface IProps {
  creator: User | null;
}

export const CreatorInfo = ({ creator }: IProps): JSX.Element => {
  const avatarMemo = useMemo((): string | '' => {
    return creator?.avatar || '';
  }, [creator]);
  if (!creator) return <></>;
  return (
    <div className={`${s.useInfo} useInfo`}>
      <div className={s.useInfo_avatar}>
        <Avatar
          imgSrcs={convertIpfsToHttp(avatarMemo)}
          fill
          // width={34}
          // height={34}
        />
      </div>
      <div className={s.userInfo_displayName}>
        {creator.displayName || formatAddress(creator.walletAddress)}
      </div>
    </div>
  );
};
