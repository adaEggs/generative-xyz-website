import { LogLevel } from '@enums/log-level';
import {
  IGetNFTListFromMoralisParams,
  IGetNFTListFromMoralisResponse,
  IGetNFTDetailFromMoralisParams,
  IGetNFTDetailFromMoralisResponse,
} from '@interfaces/api/token-moralis';
import log from '@utils/logger';
import { get } from '@services/http-client';
import querystring from 'query-string';

const LOG_PREFIX = 'TokenMoralisService';
const API_PATH = '/token-moralis';

export const getNFTListFromMoralis = async (
  params: IGetNFTListFromMoralisParams
): Promise<IGetNFTListFromMoralisResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetNFTListFromMoralisResponse>(
      `${API_PATH}/nfts${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get nft list from moralist', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get nft list from moralist');
  }
};

export const getNFTDetailFromMoralis = async (
  params: IGetNFTDetailFromMoralisParams
): Promise<IGetNFTDetailFromMoralisResponse> => {
  try {
    const { tokenAddress, ...query } = params;
    const qs = '?' + querystring.stringify(query);
    const res = await get<IGetNFTDetailFromMoralisResponse>(
      `${API_PATH}/nfts/${tokenAddress}${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get nft list from moralist', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get nft list from moralist');
  }
};
