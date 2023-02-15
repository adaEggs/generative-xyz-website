import { v4 as uuidv4 } from 'uuid';
import _isEmpty from 'lodash/isEmpty';
import ApiCaller from './aa-caller';
import { LocalStorageKey } from '@enums/local-storage';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

const LOG_PREFIX = 'AAInstance';

const AutonomousAnalytic = new ApiCaller({
  debugMode: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendAAPageView = ({ page, userId = 0, query = '' }: any): void => {
  try {
    let userPseudoId = localStorage.getItem(LocalStorageKey.USER_PSEUDO_ID);
    if (_isEmpty(userPseudoId)) {
      userPseudoId = uuidv4();
      localStorage.setItem(LocalStorageKey.USER_PSEUDO_ID, userPseudoId);
    }

    AutonomousAnalytic.trackPageView({
      pageName: page,
      userId: userId || localStorage.getItem(LocalStorageKey.USER_ID) || '',
      userWalletAddress:
        localStorage.getItem(LocalStorageKey.USER_WALLET_ADDRESS) || '',
      userPseudoId,
      query,
    });
  } catch (error: unknown) {
    log(`AutonomousAnalytic sendPageView ${error}`, LogLevel.ERROR, LOG_PREFIX);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendAAEvent = ({ eventName, data }: any): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventParams: any = [];
    eventParams.push({
      key: LocalStorageKey.USER_WALLET_ADDRESS,
      value: localStorage.getItem(LocalStorageKey.USER_WALLET_ADDRESS) || '',
    });

    data &&
      Object.keys(data || {}).map(key => {
        if (typeof data[key] === 'object') {
          eventParams.push({ key, value: JSON.stringify(data[key] ?? '') });
        } else {
          eventParams.push({ key, value: data[key] ?? '' });
        }
      });

    let userPseudoId =
      localStorage.getItem(LocalStorageKey.USER_PSEUDO_ID) ?? '';
    if (_isEmpty(userPseudoId)) {
      userPseudoId = uuidv4();
      localStorage.setItem(LocalStorageKey.USER_PSEUDO_ID, userPseudoId);
    }

    AutonomousAnalytic.trackEvent({
      eventName,
      eventParams,
      userId: localStorage.getItem(LocalStorageKey.USER_ID) || '',
      userPseudoId,
    });
  } catch (error: unknown) {
    log(`AutonomousAnalytic sendAAEvent ${error}`, LogLevel.ERROR, LOG_PREFIX);
  }
};

export { sendAAPageView, sendAAEvent };
