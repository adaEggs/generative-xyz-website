import React, {
  PropsWithChildren,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { PaymentMethod } from '@enums/mint-generative';

export interface IBitcoinProjectContext {
  paymentMethod: PaymentMethod;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;

  isPopupPayment: boolean;
  setIsPopupPayment: Dispatch<SetStateAction<boolean>>;

  paymentStep: 'switch' | 'mint';
  setPaymentStep: (s: 'switch' | 'mint') => void;
}

const initialValue: IBitcoinProjectContext = {
  paymentMethod: PaymentMethod.BTC,
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
};

export const BitcoinProjectContext =
  React.createContext<IBitcoinProjectContext>(initialValue);

export const BitcoinProjectProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const [paymentStep, setPaymentStep] = useState<'switch' | 'mint'>('switch');
  const [isPopupPayment, setIsPopupPayment] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.BTC
  );

  useEffect(() => {
    if (!isPopupPayment) {
      setPaymentStep('switch');
    }
  }, [isPopupPayment]);

  useEffect(() => {
    if (!user) {
      setPaymentStep('switch');
      setIsPopupPayment(false);
      setPaymentMethod(PaymentMethod.BTC);
    }
  }, [user]);

  const contextValues = useMemo((): IBitcoinProjectContext => {
    return {
      paymentMethod,
      setPaymentMethod,

      isPopupPayment,
      setIsPopupPayment,

      paymentStep,
      setPaymentStep,
    };
  }, [
    paymentMethod,
    setPaymentMethod,

    isPopupPayment,
    setIsPopupPayment,

    paymentStep,
    setPaymentStep,
  ]);

  return (
    <BitcoinProjectContext.Provider value={contextValues}>
      {children}
    </BitcoinProjectContext.Provider>
  );
};
