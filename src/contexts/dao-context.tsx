import { CreateDAOProposalStep } from '@enums/dao';
import { createContext, PropsWithChildren, useState } from 'react';

export type TDAOContext = {
  currentStep: CreateDAOProposalStep;
};

const initialValues: TDAOContext = {
  currentStep: CreateDAOProposalStep.INPUT_INFO,
};

export const DAOContext = createContext<TDAOContext>(initialValues);

export const DAOContextProvider = ({ children }: PropsWithChildren) => {
  const [currentStep] = useState(CreateDAOProposalStep.INPUT_INFO);

  return (
    <DAOContext.Provider
      value={{
        currentStep,
      }}
    >
      {children}
    </DAOContext.Provider>
  );
};
