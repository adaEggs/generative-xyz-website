import { NETWORK_CHAIN_ID } from '@constants/config';
import {
  GEN_DAO_TREASURY_ADDRESS,
  GEN_TOKEN_ADDRESS,
} from '@constants/contract-address';
import { CreateDAOProposalStep, VoteType } from '@enums/dao';
import useContractOperation from '@hooks/useContractOperation';
import { getUserSelector } from '@redux/user/selector';
import CastVoteProposalOperation from '@services/contract-operations/gen-dao/cast-vote-proposal';
import ExecuteProposalOperation from '@services/contract-operations/gen-dao/execute-proposal';
import SubmitProposalOperation from '@services/contract-operations/gen-dao/submit-proposal';
import DelegateGENTokenOperation from '@services/contract-operations/gen-token/delegate-token';
import { createContext, PropsWithChildren, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Web3 from 'web3';

export type TDAOContext = {
  currentStep: CreateDAOProposalStep;
  handleDelegateGENToken: () => Promise<void>;
  handleSubmitProposal: () => Promise<void>;
  handleCastVote: () => Promise<void>;
  handleExecuteProposal: () => Promise<void>;
};

const initialValues: TDAOContext = {
  currentStep: CreateDAOProposalStep.INPUT_INFO,
  handleDelegateGENToken: () => new Promise<void>(r => r()),
  handleSubmitProposal: () => new Promise<void>(r => r()),
  handleCastVote: () => new Promise<void>(r => r()),
  handleExecuteProposal: () => new Promise<void>(r => r()),
};

export const DAOContext = createContext<TDAOContext>(initialValues);

export const DAOContextProvider = ({ children }: PropsWithChildren) => {
  const user = useSelector(getUserSelector);
  const [currentStep] = useState(CreateDAOProposalStep.INPUT_INFO);
  const { call: delegateGENToken } = useContractOperation(
    DelegateGENTokenOperation,
    true
  );
  const { call: submitProposal } = useContractOperation(
    SubmitProposalOperation,
    true
  );
  const { call: castVote } = useContractOperation(
    CastVoteProposalOperation,
    true
  );
  const { call: executeProposal } = useContractOperation(
    ExecuteProposalOperation,
    true
  );

  const handleDelegateGENToken = async (): Promise<void> => {
    if (user) {
      const tx = await delegateGENToken({
        chainID: NETWORK_CHAIN_ID,
        delegateeAddress: user?.walletAddress,
      });
      // eslint-disable-next-line no-console
      console.log(tx);
    } else {
      toast.error('Login');
    }
  };

  const handleSubmitProposal = async (): Promise<void> => {
    const tx = await submitProposal({
      targets: [GEN_DAO_TREASURY_ADDRESS],
      values: ['0'],
      description: 'Test #3',
      calldatas: {
        funcName: 'transferERC20',
        args: [
          '0xBc785D855012105820Be6D8fFA7f644062a91bcA',
          GEN_TOKEN_ADDRESS,
          Web3.utils.toWei('0.001', 'ether').toString(),
        ],
      },
      chainID: NETWORK_CHAIN_ID,
    });
    // eslint-disable-next-line no-console
    console.log(tx);
  };

  const handleCastVote = async (): Promise<void> => {
    const tx = await castVote({
      chainID: NETWORK_CHAIN_ID,
      proposalId: '',
      support: VoteType.FOR,
    });
    // eslint-disable-next-line no-console
    console.log(tx);
  };

  const handleExecuteProposal = async (): Promise<void> => {
    const tx = await executeProposal({
      chainID: NETWORK_CHAIN_ID,
      proposalId:
        '4409996933815001893737690734715286661540230475573519619383200946537493431632',
    });
    // eslint-disable-next-line no-console
    console.log(tx);
  };

  return (
    <DAOContext.Provider
      value={{
        currentStep,
        handleDelegateGENToken,
        handleSubmitProposal,
        handleCastVote,
        handleExecuteProposal,
      }}
    >
      {children}
    </DAOContext.Provider>
  );
};
