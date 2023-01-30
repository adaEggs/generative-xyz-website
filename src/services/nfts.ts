import { LogLevel } from '@enums/log-level';
import {
  IGetTokenActivitiesParams,
  IGetTokenActivitiesResponse,
} from '@interfaces/api/nfts';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'NftsService';

const API_NFTS_PATH = '/nfts';

export const getTokenActivities = async (
  params: IGetTokenActivitiesParams
): Promise<IGetTokenActivitiesResponse> => {
  try {
    const { contractAddress, tokenID } = params;
    const res = await get<IGetTokenActivitiesResponse>(
      `${API_NFTS_PATH}/${contractAddress}/transactions/${tokenID}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get token activities', LogLevel.Error, LOG_PREFIX);
    throw Error('Failed to get token activities');
  }
};
