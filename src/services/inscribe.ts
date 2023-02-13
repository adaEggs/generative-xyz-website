import { LogLevel } from '@enums/log-level';
import {
  IGenerateReceiverAddressPayload,
  IGenerateReceiverAddressResponse,
} from '@interfaces/api/inscribe';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'InscribeService';

const API_PATH = '/inscribe';

export const generateReceiverAddress = async (
  payload: IGenerateReceiverAddressPayload
): Promise<IGenerateReceiverAddressResponse> => {
  try {
    const res = await post<
      IGenerateReceiverAddressPayload,
      IGenerateReceiverAddressResponse
    >(`${API_PATH}/receive-address`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to generate receiver address', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to generate receiver address');
  }
};
