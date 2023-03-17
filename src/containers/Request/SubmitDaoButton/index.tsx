/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useCallback } from 'react';
import { useAppSelector } from '@redux';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import { Formik } from 'formik';
import _isEmpty from 'lodash/isEmpty';

import ButtonIcon from '@components/ButtonIcon';
import BaseModal from '@components/Transactor';
import Input from '@components/Formik/Input';
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
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const validateForm = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    const twitterRegex = /^https?:\/\/twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/;
    const httpsRegex = /^(http|https):\/\//;

    if (values.twitter !== '' && !twitterRegex.test(values.twitter)) {
      errors.twitter = 'Invalid twitter link.';
    }

    if (!httpsRegex.test(values.website) && values.website !== '') {
      errors.website = 'Invalid website link.';
    }

    return errors;
  };
  const handleSubmit = async (values: Record<string, string>) => {
    submitVerifyMe({
      ...values,
      callback: () => {
        setIsShowModal(false);
      },
    });
  };

  return (
    <>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'Became a Generative artist and sharing your art.'
          : 'Connect wallet and became Generative artist.'}
      </div>
      <Button
        className={s.submitDaoButton_btn}
        onClick={() => setIsShowModal(true)}
        disabled={
          user === null || isClickedVerify || user?.canCreateProposal === false
        }
      >
        {isConnecting ? 'Connecting...' : 'Verify me'}
      </Button>
      <BaseModal
        isShow={isShowModal}
        onHide={() => setIsShowModal(false)}
        title="Submit profile"
      >
        <>
          <div className={s.submitDaoButton_profileText}>
            Please input your twitter to create the proposal.
          </div>
          <Formik
            initialValues={{
              website: '',
              twitter: '',
            }}
            validate={validateForm}
            onSubmit={handleSubmit}
            validateOnChange
          >
            {({ handleSubmit, isSubmitting, dirty, errors }) => (
              <form>
                <Input
                  name="twitter"
                  label="twitter"
                  placeholder="https://twitter.com/..."
                  className={s.submitDaoButton_input}
                  errors={{ twitter: errors.twitter || '' }}
                  useFormik
                />
                <div className={s.submitDaoButton_mb24} />
                <Input
                  name="website"
                  label="website"
                  placeholder="https://"
                  className={s.submitDaoButton_input}
                  useFormik
                  errors={{ website: errors.website || '' }}
                />
                <div className={s.submitDaoButton_submitBtn}>
                  <ButtonIcon
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || !dirty || !_isEmpty(errors)}
                  >
                    Submit
                  </ButtonIcon>
                </div>
              </form>
            )}
          </Formik>
        </>
      </BaseModal>
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
  //     setIsConnecting(false);
  //   } else {
  //     handleConnectWallet();
  //   }
  // }, [user]);

  const submitVerifyMe = useCallback(
    async ({ twitter, website, callback }: any) => {
      if (user) {
        setIsConnecting(true);
        toast.remove();
        const result = await createDaoArtist(twitter, website);
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
      typeof callback === 'function' && callback();
    },
    [user]
  );

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
