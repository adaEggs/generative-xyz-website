import React, { useState, useContext, useCallback } from 'react';
import { useAppSelector } from '@redux';
import cn from 'classnames';
import { toast } from 'react-hot-toast';

import { ErrorMessage } from '@enums/error-message';
import Button from '@components/Button';
import { WalletContext } from '@contexts/wallet-context';
import { getUserSelector } from '@redux/user/selector';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { DAO_TYPE } from '@constants/dao';
import { createDaoArtist } from '@services/request';

import s from './SubmitDaoButton.module.scss';

interface SubmitDaoButtonProps {
  className?: string;
  currentTabActive: number;
}

const LOG_PREFIX = 'DAOPage';

export const SubmitDaoButton = ({
  className,
  currentTabActive,
}: SubmitDaoButtonProps): JSX.Element => {
  const { connect } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isClickedVerify, setIsClickedVerify] = useState<boolean>(false);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const submitVerifyMe = useCallback(async () => {
    if (user) {
      setIsConnecting(true);
      toast.remove();
      const result = await createDaoArtist();
      if (result) {
        toast.success('Submit proposal successfully.');
      } else {
        toast.error(ErrorMessage.DEFAULT);
      }
      setIsConnecting(false);
      setIsClickedVerify(true);
    } else {
      handleConnectWallet();
    }
  }, [user]);

  if (currentTabActive !== DAO_TYPE.ARTIST) return <></>;

  return (
    <div className={cn(s.submitDaoButton, className)}>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'Connect wallet and became Generative artist.'
          : 'Became a Generative artist and sharing your art.'}
      </div>
      <Button
        className={s.submitDaoButton_btn}
        onClick={submitVerifyMe}
        disabled={
          user === null || isClickedVerify || user?.canCreateProposal === false
        }
      >
        {isConnecting ? 'Connecting...' : 'Verify me'}
      </Button>
    </div>
  );
};

export default React.memo(SubmitDaoButton);
