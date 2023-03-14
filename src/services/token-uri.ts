import { LogLevel } from '@enums/log-level';
import {
  ICreateTokenThumbnailPayload,
  IGetGenerativeTokenAttributesParams,
  IGetGenerativeTokenAttributesResponse,
  IGetGenerativeTokenUriListParams,
  IGetGenerativeTokenUriListResponse,
  IGetGenerativeTokenUriParams,
  IGetGenerativeTokenUriResponse,
} from '@interfaces/api/token-uri';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';

const LOG_PREFIX = 'TokenUriService';

const API_TOKEN_URI_PATH = '/tokens';
const API_TOKEN_TRAIT_PATH = `${API_TOKEN_URI_PATH}/traits`;

export const getTokenUri = async (
  params: IGetGenerativeTokenUriParams
): Promise<IGetGenerativeTokenUriResponse> => {
  try {
    const { contractAddress, tokenID } = params;
    // const qs = '?' + querystring.stringify(params);
    const res = await get<IGetGenerativeTokenUriResponse>(
      `${API_TOKEN_URI_PATH}/${contractAddress}/${tokenID}`
    );
    return res;
  } catch (err: unknown) {
    log(
      `failed to get token uri ${JSON.stringify(params)}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get token uri');
  }
};

export const getTokenAttributes = async (
  params: IGetGenerativeTokenAttributesParams
): Promise<IGetGenerativeTokenAttributesResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetGenerativeTokenUriResponse>(
      `${API_TOKEN_TRAIT_PATH}${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get token attributes', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get token attributes');
  }
};

export const getTokenUriList = async (
  params: IGetGenerativeTokenUriListParams
): Promise<IGetGenerativeTokenUriListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetGenerativeTokenUriListResponse>(
      `/token-uri${qs}`
    );
    return res;
  } catch (err: unknown) {
    log(
      `failed to get token uri list ${JSON.stringify(params)}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    throw Error('Failed to get token uri list');
  }
};

export const createTokenThumbnail = async (
  payload: ICreateTokenThumbnailPayload
): Promise<unknown> => {
  try {
    const { tokenID, ...body } = payload;
    const res = await post(`${API_TOKEN_URI_PATH}/${tokenID}/thumbnail`, body);
    return res;
  } catch (err: unknown) {
    log(
      `failed to create token thumbnail ${payload.tokenID}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    throw Error('Failed to create token thumbnail');
  }
};
