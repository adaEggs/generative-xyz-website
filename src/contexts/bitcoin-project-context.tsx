import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

export interface IBitcoinProjectContext {
  countDown: string;
  aVailable: boolean;
  paymentMethod: 'ETH' | 'BTC';
  setPaymentMethod: Dispatch<SetStateAction<'ETH' | 'BTC'>>;

  isPopupPayment: boolean;
  setIsPopupPayment: Dispatch<SetStateAction<boolean>>;

  paymentStep: 'switch' | 'info' | 'mint';
  setPaymentStep: (s: 'switch' | 'info' | 'mint') => void;
}

const initialValue: IBitcoinProjectContext = {
  countDown: 'EXPIRED',
  aVailable: true,

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
};

export const BitcoinProjectContext =
  React.createContext<IBitcoinProjectContext>(initialValue);

export const BitcoinProjectProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const refOg = useRef<ReturnType<typeof setInterval> | null>(null);
  const [countDown, setCountDown] = useState<string>('EXPIRED');
  const [aVailable, setAVailable] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'switch' | 'info' | 'mint'>(
    'switch'
  );
  const [isPopupPayment, setIsPopupPayment] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'BTC'>('BTC');

  const getCountDown = useCallback(() => {
    const countDownDate = new Date('Feb 16, 2023 16:00:00 UTC').getTime();

    refOg.current = setInterval(function () {
      const now = new Date().getTime();

      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountDown(
        (days < 10 ? '0' + days : days) +
          'd : ' +
          (hours < 10 ? '0' + hours : hours) +
          'h : ' +
          (minutes < 10 ? '0' + minutes : minutes) +
          'm : ' +
          (seconds < 10 ? '0' + seconds : seconds) +
          's '
      );

      if (distance < 0) {
        refOg.current && clearInterval(refOg.current);
        setAVailable(false);
        setCountDown('EXPIRED');
      } else {
        setAVailable(true);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    getCountDown();
    return () => {
      refOg.current && clearInterval(refOg.current);
    };
  }, []);

  const contextValues = useMemo((): IBitcoinProjectContext => {
    return {
      countDown,
      aVailable,

      paymentMethod,
      setPaymentMethod,

      isPopupPayment,
      setIsPopupPayment,

      paymentStep,
      setPaymentStep,
    };
  }, [
    countDown,
    aVailable,

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
