import { LogLevel } from '@enums/log-level';
import {
  ICreateFCMTokenPayload,
  ICreateFCMTokenResponse,
} from '@interfaces/fcm';
import log from '@utils/logger';
import { post } from './http-client';

const LOG_PREFIX = 'FCMService';
const API_PATH = '/fcm';

export const createFCMToken = async (
  payload: ICreateFCMTokenPayload
): Promise<ICreateFCMTokenResponse> => {
  try {
    const res = await post<ICreateFCMTokenPayload, ICreateFCMTokenResponse>(
      `${API_PATH}/token`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to generate receiver address', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to generate receiver address');
  }
};
