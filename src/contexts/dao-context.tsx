import { NETWORK_CHAIN_ID } from '@constants/config';
import {
  GEN_DAO_TREASURY_ADDRESS,
  GEN_TOKEN_ADDRESS,
} from '@constants/contract-address';
import { INITIAL_FORM_VALUES } from '@constants/dao';
import { CreateProposalDisplayMode, VoteType } from '@enums/dao';
import { LogLevel } from '@enums/log-level';
import { TokenType } from '@enums/token-type';
import useContractOperation from '@hooks/useContractOperation';
import { IFormValue } from '@interfaces/dao';
import { getUserSelector } from '@redux/user/selector';
import CastVoteProposalOperation from '@services/contract-operations/gen-dao/cast-vote-proposal';
import ExecuteProposalOperation from '@services/contract-operations/gen-dao/execute-proposal';
import SubmitProposalOperation from '@services/contract-operations/gen-dao/submit-proposal';
import DelegateGENTokenOperation from '@services/contract-operations/gen-token/delegate-token';
import { createProposal } from '@services/dao';
import log from '@utils/logger';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Web3 from 'web3';

const LOG_PREFIX = 'DAOContext';

export type TDAOContext = {
  isFormValid: boolean;
  setIsFormValid: Dispatch<SetStateAction<boolean>>;
  displayMode: CreateProposalDisplayMode;
  setDisplayMode: Dispatch<SetStateAction<CreateProposalDisplayMode>>;
  formValues: Partial<IFormValue>;
  setFormValues: Dispatch<SetStateAction<Partial<IFormValue>>>;
  handleDelegateGENToken: () => Promise<void>;
  handleSubmitProposal: (_: IFormValue) => Promise<void>;
  handleCastVote: () => Promise<void>;
  handleExecuteProposal: () => Promise<void>;
};

const initialValues: TDAOContext = {
  isFormValid: false,
  setIsFormValid: _ => {
    return;
  },
  displayMode: CreateProposalDisplayMode.INPUT_INFO,
  setDisplayMode: _ => {
    return;
  },
  formValues: INITIAL_FORM_VALUES,
  setFormValues: _ => {
    return;
  },
  handleDelegateGENToken: () => new Promise<void>(r => r()),
  handleSubmitProposal: () => new Promise<void>(r => r()),
  handleCastVote: () => new Promise<void>(r => r()),
  handleExecuteProposal: () => new Promise<void>(r => r()),
};

export const DAOContext = createContext<TDAOContext>(initialValues);

export const DAOContextProvider = ({ children }: PropsWithChildren) => {
  const user = useSelector(getUserSelector);
  const [displayMode, setDisplayMode] = useState(
    CreateProposalDisplayMode.INPUT_INFO
  );
  const [formValues, setFormValues] =
    useState<Partial<IFormValue>>(INITIAL_FORM_VALUES);
  const [isFormValid, setIsFormValid] = useState(false);
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

  const handleSubmitProposal = async (payload: IFormValue): Promise<void> => {
    try {
      const { title, description, amount, tokenType, receiverAddress } =
        payload;

      await createProposal({
        title,
        description,
      });

      const funcName =
        tokenType === TokenType.NATIVE ? 'transfer' : 'transferERC20';
      const args =
        tokenType === TokenType.NATIVE
          ? [
              receiverAddress,
              Web3.utils.toWei(amount.toString(), 'ether').toString(),
            ]
          : [
              receiverAddress,
              GEN_TOKEN_ADDRESS,
              Web3.utils.toWei(amount.toString(), 'ether').toString(),
            ];

      await submitProposal({
        targets: [GEN_DAO_TREASURY_ADDRESS],
        values: ['0'],
        description: title,
        calldatas: {
          funcName,
          args,
        },
        chainID: NETWORK_CHAIN_ID,
      });
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      throw Error('Can not submit proposal');
    }
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
        isFormValid,
        setIsFormValid,
        displayMode,
        setDisplayMode,
        formValues,
        setFormValues,
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