import React, { useEffect } from 'react';
import s from './styles.module.scss';
import useCountDown from '@hooks/useCountDown';

interface IProps {
  openMintUnixTimestamp: number;
  closeMintUnixTimestamp: number;
  setIsAvailable?: (b: boolean) => void;
  isDetail?: boolean;
}

export const CountDown = ({
  openMintUnixTimestamp,
  closeMintUnixTimestamp,
  setIsAvailable,
  isDetail = false,
}: IProps): JSX.Element => {
  const { countDown, available } = useCountDown(
    openMintUnixTimestamp || 0,
    closeMintUnixTimestamp || 0
  );

  useEffect(() => {
    setIsAvailable && setIsAvailable(available);
  }, [available]);

  return countDown !== '' ? (
    <div className={`${s.countDown} ${isDetail ? s.isDetail : ''}`}>
      {countDown}
    </div>
  ) : (
    <></>
  );
};
