import { LogLevel } from '@enums/log-level';
import { post } from '@services/http-client';
import log from '@utils/logger';
import { IPostReferralCode } from '@interfaces/api/referrals';

const LOG_PREFIX = 'ReferralsService';

const API_PATH = '/referrals';

export const postReferralCode = async (
  code: string
): Promise<IPostReferralCode> => {
  try {
    const dataForm = {};
    return post<Record<string, string>, IPostReferralCode>(
      `${API_PATH}/${code}`,
      dataForm
    );
  } catch (err: unknown) {
    log('failed to get Marketplace Btc List', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Btc List');
  }
};
