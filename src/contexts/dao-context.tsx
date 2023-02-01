import { createContext, PropsWithChildren, useState } from 'react';

export type TDAOContext = {
  currentStep: number;
};

const initialValues: TDAOContext = {
  currentStep: 1,
};

export const DAOContext = createContext<TDAOContext>(initialValues);

export const DAOContextProvider = ({ children }: PropsWithChildren) => {
  const [currentStep] = useState(0);

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
