import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface IBitcoinContext {
  countDown: string;
  aVailable: boolean;
}

const initialValue: IBitcoinContext = {
  countDown: 'EXPIRED',
  aVailable: true,
};

export const BitcoinContext =
  React.createContext<IBitcoinContext>(initialValue);

export const BitcoinProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const refOg = useRef<ReturnType<typeof setInterval> | null>(null);
  const [countDown, setCountDown] = useState<string>('EXPIRED');
  const [aVailable, setAVailable] = useState<boolean>(false);

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

  const contextValues = useMemo((): IBitcoinContext => {
    return {
      countDown,
      aVailable,
    };
  }, [countDown, aVailable]);

  return (
    <BitcoinContext.Provider value={contextValues}>
      {children}
    </BitcoinContext.Provider>
  );
};
