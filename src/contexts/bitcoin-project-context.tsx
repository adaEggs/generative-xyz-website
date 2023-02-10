import React, {
  PropsWithChildren,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

export interface IBitcoinProjectContext {
  paymentMethod: 'ETH' | 'BTC';
  setPaymentMethod: Dispatch<SetStateAction<'ETH' | 'BTC'>>;

  isPopupPayment: boolean;
  setIsPopupPayment: Dispatch<SetStateAction<boolean>>;

  paymentStep: 'switch' | 'mint';
  setPaymentStep: (s: 'switch' | 'mint') => void;

  defaultCloseMintUnixTimestamp: number;
}

const initialValue: IBitcoinProjectContext = {
  paymentMethod: 'BTC',
  setPaymentMethod: _ => {
    return;
  },

  isPopupPayment: false,
  setIsPopupPayment: _ => {
    return;
  },

  paymentStep: 'switch',
  setPaymentStep: _ => {
    return;
  },

  defaultCloseMintUnixTimestamp:
    new Date('Feb 16, 2023 16:00:00 UTC').getTime() / 1000,
};

export const BitcoinProjectContext =
  React.createContext<IBitcoinProjectContext>(initialValue);

export const BitcoinProjectProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [paymentStep, setPaymentStep] = useState<'switch' | 'mint'>('switch');
  const [isPopupPayment, setIsPopupPayment] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'BTC'>('BTC');
  const defaultCloseMintUnixTimestamp =
    new Date('Feb 16, 2023 16:00:00 UTC').getTime() / 1000;

  useEffect(() => {
    if (!isPopupPayment) {
      setPaymentStep('switch');
    }
  }, [isPopupPayment]);

  const contextValues = useMemo((): IBitcoinProjectContext => {
    return {
      paymentMethod,
      setPaymentMethod,

      isPopupPayment,
      setIsPopupPayment,

      paymentStep,
      setPaymentStep,

      defaultCloseMintUnixTimestamp,
    };
  }, [
    paymentMethod,
    setPaymentMethod,

    isPopupPayment,
    setIsPopupPayment,

    paymentStep,
    setPaymentStep,
    defaultCloseMintUnixTimestamp,
  ]);

  return (
    <BitcoinProjectContext.Provider value={contextValues}>
      {children}
    </BitcoinProjectContext.Provider>
  );
};
