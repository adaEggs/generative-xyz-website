import { BTC_PROJECT } from '@constants/tracking-event-name';
import { sendAAEvent } from '@services/aa-tracking';
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
      sendAAEvent({
        eventName: BTC_PROJECT.REFERRED_USER,
        data: {
          referrer_id: code,
        },
      });
    }
  }
};

export const getReferral = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(REFERRAL_KEY);
  }
  return null;
};
