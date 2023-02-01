import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { resetUser, setUser } from '@redux/user/action';
import { getProfile } from '@services/profile';
import { clearAuthStorage, getAccessToken } from '@utils/auth';
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
        log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
        clearAuthStorage();
        dispatch(resetUser());
      }
    }
  };

  useEffect(() => {
    fetchProfileByToken();
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
