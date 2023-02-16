import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { resetUser, setUser } from '@redux/user/action';
import { getProfile } from '@services/profile';
import { clearAuthStorage, getAccessToken, setUserInfo } from '@utils/auth';
import log from '@utils/logger';
import React, { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';
import { User } from '@interfaces/user';

const LOG_PREFIX = 'AuthWrapper';

const AuthWrapper: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const checkUserRedirect = (userRes: User | null) => {
    if (router.pathname === ROUTE_PATH.PROFILE && !userRes) {
      router.push(ROUTE_PATH.COLLECTIONS);
    }
  };

  const fetchProfileByToken = async (): Promise<void> => {
    const accessToken = getAccessToken();
    if (accessToken) {
      try {
        const userRes = await getProfile();
        checkUserRedirect(userRes);
        setUserInfo(userRes);
        dispatch(setUser(userRes));
      } catch (err: unknown) {
        log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
        clearAuthStorage();
        dispatch(resetUser());
      }
    } else {
      checkUserRedirect(null);
    }
  };

  useEffect(() => {
    fetchProfileByToken();
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
