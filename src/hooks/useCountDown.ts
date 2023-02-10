import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const useCountDown = (
  openMintUnixTimestamp = 0,
  closeMintUnixTimestamp = 0
): { available: boolean; countDown: string } => {
  const refOg = useRef<ReturnType<typeof setInterval> | null>(null);
  const [countDown, setCountDown] = useState<string>('');
  const [available, setAvailable] = useState<boolean>(false);

  const startCountDown = useCallback(() => {
    const closeMintUTC = new Date(closeMintUnixTimestamp * 1000).getTime();
    refOg.current = setInterval(function () {
      const now = new Date().getTime();

      const distance = closeMintUTC - now;

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
        setAvailable(false);
        setCountDown('EXPIRED');
      } else {
        setAvailable(true);
      }
    }, 1000);
  }, [closeMintUnixTimestamp]);

  useLayoutEffect(() => {
    if (openMintUnixTimestamp === 0 && closeMintUnixTimestamp === 0) {
      setAvailable(true);
      setCountDown('');
    } else if (openMintUnixTimestamp && closeMintUnixTimestamp === 0) {
      const openMintUTC = new Date(openMintUnixTimestamp * 1000).getTime();
      const currentMintUTC = new Date().getTime();

      if (currentMintUTC < openMintUTC) {
        setAvailable(false);
        setCountDown('COMING SOON');
      } else {
        setAvailable(true);
        setCountDown('');
      }
    } else if (openMintUnixTimestamp === 0 && closeMintUnixTimestamp) {
      startCountDown();
    } else {
      const openMintUTC = new Date(openMintUnixTimestamp * 1000).getTime();
      const currentMintUTC = new Date().getTime();

      if (currentMintUTC < openMintUTC) {
        setAvailable(false);
        setCountDown('COMING SOON');
      } else {
        startCountDown();
      }
    }

    return () => {
      refOg.current && clearInterval(refOg.current);
      setAvailable(false);
      setCountDown('');
    };
  }, [openMintUnixTimestamp, closeMintUnixTimestamp]);

  return { available, countDown };
};

export default useCountDown;
