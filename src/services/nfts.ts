import { LogLevel } from '@enums/log-level';
import {
  IGetTokenActivitiesParams,
  IGetTokenActivitiesResponse,
  IGetNFTHolderListParams,
  IGetNFTHolderListResponse,
} from '@interfaces/api/nfts';
import { get } from '@services/http-client';
import log from '@utils/logger';
import queryString from 'query-string';

const LOG_PREFIX = 'NftsService';

const API_PATH = '/nfts';

export const getTokenActivities = async (
  params: IGetTokenActivitiesParams
): Promise<IGetTokenActivitiesResponse> => {
  try {
    const { contractAddress, tokenID } = params;
    const res = await get<IGetTokenActivitiesResponse>(
      `${API_PATH}/${contractAddress}/transactions/${tokenID}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get token activities', LogLevel.Error, LOG_PREFIX);
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
    log('failed to get nft holder list', LogLevel.Error, LOG_PREFIX);
    throw Error('Failed to get nft holder list');
  }
};
