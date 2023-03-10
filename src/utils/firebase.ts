import { LocalStorageKey } from '@enums/local-storage';
import { isBrowser } from './common';

export const getFCMToken = (): string | null => {
  if (isBrowser()) {
    const fcmToken = localStorage.getItem(LocalStorageKey.FCM_TOKEN);
    return fcmToken;
  }
  return null;
};

export const setFCMToken = (token: string): void => {
  if (isBrowser()) {
    localStorage.setItem(LocalStorageKey.FCM_TOKEN, token);
  }
};
