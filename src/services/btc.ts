import { LogLevel } from '@enums/log-level';
import {
  IGenerateReceiverAddressPayload,
  IGenerateReceiverAddressResponse,
  IMintGenerativePayload,
  IMintGenerativePayloadResponse,
} from '@interfaces/api/btc';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'BTCService';

const API_PATH = '/btc';

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

export const mintBTCGenerative = async (
  payload: IMintGenerativePayload
): Promise<IMintGenerativePayloadResponse> => {
  try {
    const res = await post<
      IMintGenerativePayload,
      IMintGenerativePayloadResponse
    >(`${API_PATH}/mint`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to mint btc generative', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to mint btc generative');
  }
};
