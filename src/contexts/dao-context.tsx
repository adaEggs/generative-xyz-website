import { NETWORK_CHAIN_ID } from '@constants/config';
import { CreateDAOProposalStep } from '@enums/dao';
import useContractOperation from '@hooks/useContractOperation';
import SubmitProposalOperation from '@services/contract-operations/gen-dao/submit-proposal';
import DelegateGENTokenOperation from '@services/contract-operations/gen-token/delegate-token';
import { createContext, PropsWithChildren, useState } from 'react';
import Web3 from 'web3';

export type TDAOContext = {
  currentStep: CreateDAOProposalStep;
  handleDelegateGENToken: () => Promise<void>;
};

const initialValues: TDAOContext = {
  currentStep: CreateDAOProposalStep.INPUT_INFO,
  handleDelegateGENToken: () => new Promise<void>(r => r()),
};

export const DAOContext = createContext<TDAOContext>(initialValues);

export const DAOContextProvider = ({ children }: PropsWithChildren) => {
  const [currentStep] = useState(CreateDAOProposalStep.INPUT_INFO);
  const { call: delegateGENToken } = useContractOperation(
    DelegateGENTokenOperation,
    true
  );
  const { call: submitProposal } = useContractOperation(
    SubmitProposalOperation,
    true
  );

  const handleDelegateGENToken = async (): Promise<void> => {
    await delegateGENToken({
      chainID: NETWORK_CHAIN_ID,
      delegateeAddress: '',
    });

    await submitProposal({
      targets: ['0x0000000000000000000000000000000000000000'],
      values: ['0'],
      description: 'Test #1',
      calldatas: {
        funcName: 'transfer',
        args: [
          '0xBc785D855012105820Be6D8fFA7f644062a91bcA',
          Web3.utils.toWei('0.001', 'ether').toString(),
        ],
      },
      chainID: NETWORK_CHAIN_ID,
    });
  };

  return (
    <DAOContext.Provider
      value={{
        currentStep,
        handleDelegateGENToken,
      }}
    >
      {children}
    </DAOContext.Provider>
  );
};
