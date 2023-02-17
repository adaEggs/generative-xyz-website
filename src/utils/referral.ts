import { isBrowser } from '@utils/common';

const REFERRAL_KEY = 'referral_code';

export const getReferralCodeURLParameter = (): string | null => {
  const params = new URLSearchParams(window?.location?.search);
  return params.get(REFERRAL_KEY);
};

export const setReferral = (code: string) => {
  if (isBrowser()) {
    const check = !getReferral(); // apply first click
    if (check) {
      localStorage.setItem(REFERRAL_KEY, code);
    }
  }
};

export const getReferral = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(REFERRAL_KEY);
  }
  return null;
};
