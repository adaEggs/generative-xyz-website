import { APP_ENV } from '@constants/config';
import { ApplicationEnvironment } from '@enums/config';

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
  if (typeof window === 'undefined') {
    return false;
  }

  const width = window.innerWidth || document.body.clientWidth;
  return width < 768;
};

export const isTabletScreen = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  const width = window.innerWidth || document.body.clientWidth;
  return width >= 768 && width < 1025;
};

export const isTabletOrPhone = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const width = window.innerWidth || document.body.clientWidth;
  return width < 1025;
};
