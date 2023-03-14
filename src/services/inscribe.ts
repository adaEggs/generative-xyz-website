import { LogLevel } from '@enums/log-level';
import {
  IGenerateReceiverAddressPayload,
  IGenerateReceiverAddressResponse,
  IGetInscriptionListByUserParams,
  IGetInscriptionListByUserResponse,
} from '@interfaces/api/inscribe';
import { post, get } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';

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

export const generateAuthReceiverAddress = async (
  payload: IGenerateReceiverAddressPayload
): Promise<IGenerateReceiverAddressResponse> => {
  try {
    const res = await post<
      IGenerateReceiverAddressPayload,
      IGenerateReceiverAddressResponse
    >(`${API_PATH}/auth/receive-address`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to generate receiver address', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to generate receiver address');
  }
};

export const getInscriptionListByUser = async (
  params: IGetInscriptionListByUserParams
): Promise<IGetInscriptionListByUserResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetInscriptionListByUserResponse>(
      `${API_PATH}/list${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get inscription list by user', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get inscription list by user');
  }
};
