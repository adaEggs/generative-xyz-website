import { ProposalVote } from '@interfaces/dao';
import React, { useMemo } from 'react';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL, APP_TOKEN_SYMBOL } from '@constants/config';
import Text from '@components/Text';

type TVoteProgress = {
  stats?: ProposalVote;
};

const VoteProgress = ({ stats }: TVoteProgress) => {
  const bgFor = useMemo(() => {
    return `linear-gradient(to right, #4f43e2 ${stats?.percentFor}%, #B6B6B6 ${stats?.percentFor}%)`;
  }, [stats?.percentFor]);

  const bgAgainst = useMemo(() => {
    return `linear-gradient(to right, #ff4747 ${stats?.percentAgainst}%, #B6B6B6 ${stats?.percentAgainst}%)`;
  }, [stats?.percentAgainst]);

  return (
    <div className={s.wrapper}>
      <div className={s.voteFor} style={{ background: bgFor }}>
        <div className={s.rightContent}>
          <SvgInset size={20} svgUrl={`${CDN_URL}/icons/ic-check-white.svg`} />
          <Text size="14" fontWeight="medium">
            Yes {stats?.for} {APP_TOKEN_SYMBOL}
          </Text>
        </div>
        <div className={s.leftContent}>
          <Text size="14" fontWeight="medium">
            {stats?.percentFor}%
          </Text>
        </div>
      </div>
      <div className={s.voteAgainst} style={{ background: bgAgainst }}>
        <div className={s.rightContent}>
          <SvgInset size={20} svgUrl={`${CDN_URL}/icons/ic-x-white.svg`} />
          <Text size="14" fontWeight="medium">
            No {stats?.for} {APP_TOKEN_SYMBOL}
          </Text>
        </div>
        <div className={s.leftContent}>
          <Text size="14" fontWeight="medium">
            {stats?.percentAgainst}%
          </Text>
        </div>
      </div>
    </div>
  );
};

export default VoteProgress;
