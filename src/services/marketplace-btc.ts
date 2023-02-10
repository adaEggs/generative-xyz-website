import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';

const LOG_PREFIX = 'MarketplaceBtcService';

const API_PATH = '/marketplace-btc';
export interface IGetMarketplaceBtcListParams {
  page: number;
}
export interface IGetMarketplaceBtcListItem {
  inscriptionID: string;
  price: string;
  name: string;
  description: string;
}
export interface IGetMarketplaceBtcListResponse {
  error: string;
  status: boolean;
  data: IGetMarketplaceBtcListItem[];
}
export const getMarketplaceBtcList = async (
  params: IGetMarketplaceBtcListParams
): Promise<IGetMarketplaceBtcListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetMarketplaceBtcListResponse>(
      `${API_PATH}/list${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get project list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project list');
  }
};

export interface IPostMarketplaceBtcListNFTParams {
  address: string;
  ordinals: string;
  name: string;
  description: string;
  price: string;
}
export interface IPostMarketplaceBtcListNFTResponse {
  address: string;
}
export const postMarketplaceBtcListNFT = async (
  dataFrom: IPostMarketplaceBtcListNFTParams
): Promise<IPostMarketplaceBtcListNFTResponse> => {
  try {
    const res = await post<
      IPostMarketplaceBtcListNFTParams,
      IPostMarketplaceBtcListNFTResponse
    >(`${API_PATH}/list`, dataFrom);
    return res;
  } catch (err: unknown) {
    log('failed to get project list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project list');
  }
};
