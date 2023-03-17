/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useCallback } from 'react';
import { useAppSelector } from '@redux';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import BaseModal from '@components/Transactor';

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

const SubmitCollection = ({
  user,
  isConnecting,
}: // submitCollection,
{
  user: any;
  isConnecting: boolean;
  // submitCollection: (...args: any) => any;
}) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  return (
    <>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'It’s free and simple to release art on Bitcon.'
          : 'Connect wallet to submit a collection.'}
      </div>
      <Button
        className={s.submitDaoButton_btn}
        // onClick={submitCollection}
        onClick={() => setIsShowModal(true)}
        disabled={!user}
      >
        {isConnecting ? 'Connecting...' : 'Submit a collection'}
      </Button>
      <BaseModal
        isShow={isShowModal}
        onHide={() => setIsShowModal(false)}
        title="Submit a collection"
      ></BaseModal>
    </>
  );
};

const SubmitArtist = ({
  user,
  isConnecting,
  submitVerifyMe,
  isClickedVerify,
}: {
  user: any;
  isConnecting: boolean;
  submitVerifyMe: (...args: any) => any;
  isClickedVerify: boolean;
}) => {
  return (
    <>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'Became a Generative artist and sharing your art.'
          : 'Connect wallet and became Generative artist.'}
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
    </>
  );
};

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

  // const submitCollection = useCallback(async () => {
  //   if (user) {
  //     setIsConnecting(true);
  //     toast.remove();
  //     const result = await createDaoArtist();
  //     if (result) {
  //       toast.success('Submit proposal successfully.');
  //     } else {
  //       toast.error(ErrorMessage.DEFAULT);
  //     }
  //     setIsConnecting(false);
  //     setIsClickedVerify(true);
  //   } else {
  //     handleConnectWallet();
  //   }
  // }, [user]);

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

  if (
    currentTabActive !== DAO_TYPE.ARTIST ||
    user?.profileSocial?.twitterVerified
  )
    return <></>;

  return (
    <div className={cn(s.submitDaoButton, className)}>
      {currentTabActive === DAO_TYPE.COLLECTION && (
        <SubmitCollection
          user={user}
          isConnecting={isConnecting}
          // submitCollection={submitCollection}
        />
      )}
      {currentTabActive === DAO_TYPE.ARTIST && (
        <SubmitArtist
          user={user}
          isConnecting={isConnecting}
          submitVerifyMe={submitVerifyMe}
          isClickedVerify={isClickedVerify}
        />
      )}
    </div>
  );
};

export default React.memo(SubmitDaoButton);
