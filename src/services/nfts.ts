import { LogLevel } from '@enums/log-level';
import {
  IGetNFTHolderListParams,
  IGetNFTHolderListResponse,
  IGetTokenActivitiesQuery,
  IGetTokenActivitiesResponse,
} from '@interfaces/api/nfts';
import { get } from '@services/http-client';
import log from '@utils/logger';
import queryString from 'query-string';

const LOG_PREFIX = 'NftsService';

const API_PATH = '/nfts';

export const getTokenActivities = async (
  // params: IGetTokenActivitiesParams,
  query: IGetTokenActivitiesQuery
): Promise<IGetTokenActivitiesResponse> => {
  try {
    const qs = '?' + queryString.stringify(query);
    const res = await get<IGetTokenActivitiesResponse>(
      `/token-activities${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get token activities', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get token activities');
  }
};

export const getNFTHolderList = async (
  params: IGetNFTHolderListParams
): Promise<IGetNFTHolderListResponse> => {
  try {
    const { contractAddress, ...paging } = params;
    const qs = '?' + queryString.stringify(paging);
    const res = await get<IGetNFTHolderListResponse>(
      `${API_PATH}/${contractAddress}/nft_holders${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get nft holder list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get nft holder list');
  }
};
