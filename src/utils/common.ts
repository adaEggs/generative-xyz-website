import { APP_ENV } from '@constants/config';
import { ApplicationEnvironment } from '@enums/config';
import { WALLET_WHITELIST } from '@constants/wallet';

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const isProduction = (): boolean => {
  return APP_ENV === ApplicationEnvironment.PRODUCTION;
};

export const isStaging = (): boolean => {
  return APP_ENV === ApplicationEnvironment.STAGING;
};

export const getScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
};

export const isPhoneScreen = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const width = window.innerWidth || document.body.clientWidth;
  return width < 768;
};

export const isTabletScreen = (): boolean => {
  if (!isBrowser()) {
    return false;
  }
  const width = window.innerWidth || document.body.clientWidth;
  return width >= 768 && width < 1025;
};

export const isTabletOrPhone = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const width = window.innerWidth || document.body.clientWidth;
  return width < 1025;
};

export const isWalletWhiteList = (walletAddress: string) => {
  return WALLET_WHITELIST.indexOf(walletAddress) !== -1;
};

export const wordCase = (name: string): string => {
  const words = name.split(' ');
  return words.length
    ? words
        .map(word => {
          return word.length
            ? word.toLowerCase()[0].toUpperCase() +
                word.toLowerCase().substring(1)
            : '';
        })
        .join(' ')
    : '';
};
