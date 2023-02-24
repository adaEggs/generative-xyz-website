import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import {
  IPostReferralCode,
  IGetReferralsParams,
  IGetReferralsResponse,
} from '@interfaces/api/referrals';
import queryString from 'query-string';

const LOG_PREFIX = 'ReferralsService';

const API_PATH = '/referrals';

export const getReferrals = async (
  params: IGetReferralsParams
): Promise<IGetReferralsResponse> => {
  try {
    const qs = '?' + queryString.stringify(params);
    const res = await get<IGetReferralsResponse>(`${API_PATH}${qs}`);
    if (res && res.result) {
      return res;
    }
    return { result: [], page: 0, pageSize: 0, total: 0 };
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    return { result: [], page: 0, pageSize: 0, total: 0 };
  }
};

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
    log('failed to add referee', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to add referee');
  }
};
