import { LogLevel } from '@enums/log-level';
import {
  IGenerateReceiverAddressPayload,
  IGenerateReceiverAddressResponse,
  IGenerateReceiverAddressV2Payload,
  IGenerateReceiverAddressV2Response,
  IMintGenerativePayload,
  IMintGenerativePayloadResponse,
} from '@interfaces/api/btc';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'BTCService';

const API_PATH = '/btc';
const API_PATH_V2 = '/btc-v2';

export const generateBTCReceiverAddress = async (
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

export const generateBTCReceiverAddressV2 = async (
  payload: IGenerateReceiverAddressV2Payload
): Promise<IGenerateReceiverAddressV2Response> => {
  try {
    const res = await post<
      IGenerateReceiverAddressV2Payload,
      IGenerateReceiverAddressV2Response
    >(`${API_PATH_V2}/receive-address`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to generate receiver address v2', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to generate receiver address v2');
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
