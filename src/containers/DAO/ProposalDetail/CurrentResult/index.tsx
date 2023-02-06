import s from './styles.module.scss';
import Button from '@components/ButtonIcon';
import { CDN_URL, NETWORK_CHAIN_ID } from '@constants/config';
import { GEN_TOKEN_ADDRESS } from '@constants/contract-address';
import { EXTERNAL_LINK } from '@constants/external-link';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import useContractOperation from '@hooks/useContractOperation';
import { Proposal } from '@interfaces/dao';
import { getUserSelector } from '@redux/user/selector';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import useAsyncEffect from 'use-async-effect';
import SvgInset from '@components/SvgInset';
import { VoteType } from '@enums/dao';
import cs from 'classnames';
import CastVoteProposalOperation from '@services/contract-operations/gen-dao/cast-vote-proposal';
import { toast } from 'react-hot-toast';

const LOG_PREFIX = 'CurrentResult';

interface IProps {
  proposal: Proposal | null;
}

const CurrentResult: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { proposal } = props;
  const router = useRouter();
  const { connect } = useContext(WalletContext);
  const user = useSelector(getUserSelector);
  const [support, setSupport] = useState(VoteType.FOR);
  const [genBalance, setGenBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const { call: getTokenBalance } = useContractOperation(
    GetTokenBalanceOperation,
    false
  );
  const { call: castVote } = useContractOperation(
    CastVoteProposalOperation,
    true
  );

  const handleCastVote = async (): Promise<void> => {
    if (!proposal) {
      toast.error('Proposal not found');
      return;
    }

    const _tx = await castVote({
      chainID: NETWORK_CHAIN_ID,
      proposalId: proposal.proposalID,
      support,
    });

    // console.log(tx);
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const navigateToDocsPage = (): void => {
    router.push(EXTERNAL_LINK.PROOF_OF_ART_DOCS);
  };

  const handleChooseSupport = (vote: VoteType): void => {
    setSupport(vote);
  };

  useAsyncEffect(async () => {
    const balance = await getTokenBalance({
      chainID: NETWORK_CHAIN_ID,
      erc20TokenAddress: GEN_TOKEN_ADDRESS,
    });
    if (balance !== null) {
      setGenBalance(balance);
    }
  }, [user]);

  return (
    <div className={s.currentResult}>
      <h2 className={s.sectionTitle}>Current results</h2>

      {!user && (
        <>
          <p className={s.startDate}>{`Start in 1 day`}</p>
          <Button
            disabled={isConnecting}
            onClick={handleConnectWallet}
            className={s.connectBtn}
          >
            {isConnecting ? 'Connecting...' : 'Connect wallet to vote'}
          </Button>
        </>
      )}

      {user && genBalance === 0 && (
        <>
          <p className={s.startDate}>{`Start in 1 day`}</p>
          <Button onClick={navigateToDocsPage} className={s.connectBtn}>
            Earn GEN
          </Button>
          <div className={s.insufficientBalanceWrapper}>
            <SvgInset
              size={18}
              svgUrl={`${CDN_URL}/icons/ic-wallet-24x24.svg`}
            />
            <span>Not enough GEN to vote</span>
          </div>
        </>
      )}

      {user && genBalance > 0 && (
        <>
          <div className={s.currentVotingResultWrapper}>
            <p className={s.startDate}>Yes: 90%</p>
            <p className={s.startDate}>No: 10%</p>
            <p className={s.startDate}>{`Start in 1 day`}</p>
            <div className={s.choiceList}>
              <div
                onClick={() => handleChooseSupport(VoteType.FOR)}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]: support === VoteType.FOR,
                })}
              >
                Yes
                <span className={s.checkmark}></span>
              </div>
              <div
                onClick={() => handleChooseSupport(VoteType.AGAINST)}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]: support === VoteType.AGAINST,
                })}
              >
                No
                <span className={s.checkmark}></span>
              </div>
            </div>
            <Button onClick={handleCastVote} className={s.connectBtn}>
              Cast your vote
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentResult;
