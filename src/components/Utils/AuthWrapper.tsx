import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { setUser } from '@redux/user/action';
import { getProfile } from '@services/profile';
import { getAccessToken } from '@utils/auth';
import log from '@utils/logger';
import React, { PropsWithChildren, useEffect } from 'react';

const LOG_PREFIX = 'AuthWrapper';

const AuthWrapper: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const dispatch = useAppDispatch();

  const fetchProfileByToken = async (): Promise<void> => {
    const accessToken = getAccessToken();
    if (accessToken) {
      try {
        const userRes = await getProfile();
        dispatch(setUser(userRes));
      } catch (err: unknown) {
        log('failed to get profile', LogLevel.Error, LOG_PREFIX);
      }
    }
  };

  useEffect(() => {
    fetchProfileByToken();
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
