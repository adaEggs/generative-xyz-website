import React from 'react';
import Button from '@components/ButtonIcon';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import {
  APP_TOKEN_SYMBOL,
  CDN_URL,
  GEN_REQUIRE_TO_VOTE,
} from '@constants/config';
import { VoteType } from '@enums/dao';
import cs from 'classnames';
import Web3 from 'web3';
import { formatCurrency } from '@utils/format';

interface IProps {
  handleClose: () => void;
  handleVote: () => void;
  isShow: boolean;
  genBalance: number;
  support: VoteType;
  isVoting: boolean;
}

const CastVoteModal: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { handleClose, handleVote, isShow, genBalance, support, isVoting } =
    props;

  if (!isShow) {
    return <></>;
  }

  return (
    <div className={s.castVoteModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={handleClose}
                className={s.closeBtn}
                variants="ghost"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              <h3 className={s.modalTitle}>Cast your vote</h3>
              <div className={s.summaryWrapper}>
                <div className={s.summaryItem}>
                  <span className={s.summaryText}>Choice</span>
                  <span
                    className={cs(s.summaryChoice, {
                      [`${s.summaryChoice__yes}`]: support === VoteType.FOR,
                      [`${s.summaryChoice__no}`]: support === VoteType.AGAINST,
                    })}
                  >
                    {support === VoteType.FOR ? 'For' : 'Against'}
                  </span>
                </div>
                <div className={s.summaryItem}>
                  <span className={s.summaryText}>Your tokens</span>
                  <span className={s.summaryText}>{`${formatCurrency(
                    parseFloat(
                      Web3.utils.fromWei(genBalance.toString(), 'ether')
                    )
                  )} ${APP_TOKEN_SYMBOL}`}</span>
                </div>
                <div className={s.summaryItem}>
                  <span className={s.summaryText}>Minimum token to vote</span>
                  <span
                    className={s.summaryText}
                  >{`${GEN_REQUIRE_TO_VOTE} ${APP_TOKEN_SYMBOL}`}</span>
                </div>
              </div>
              <div className={s.divider}></div>
              <div className={s.actionWrapper}>
                <Button
                  disabled={isVoting}
                  onClick={handleClose}
                  className={s.actionBtn}
                  variants="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isVoting}
                  onClick={handleVote}
                  className={s.actionBtn}
                >
                  {isVoting ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastVoteModal;
