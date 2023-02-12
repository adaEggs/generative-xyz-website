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
  image: string;
  orderID: string;
}
export const getMarketplaceBtcList = async (
  params: IGetMarketplaceBtcListParams
): Promise<IGetMarketplaceBtcListItem[]> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetMarketplaceBtcListItem[]>(
      `${API_PATH}/list${qs}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get Marketplace Btc List', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Btc List');
  }
};

export interface IPostMarketplaceBtcListNFTParams {
  receiveAddress: string;
  receiveOrdAddress: string;
  inscriptionID: string;
  name: string;
  description: string;
  price: string;
}
export interface IPostMarketplaceBtcListNFTResponse {
  receiveAddress: string;
  timeoutAt: string;
}
export const postMarketplaceBtcListNFT = async (
  dataFrom: IPostMarketplaceBtcListNFTParams
): Promise<IPostMarketplaceBtcListNFTResponse> => {
  try {
    const res = await post<
      IPostMarketplaceBtcListNFTParams,
      IPostMarketplaceBtcListNFTResponse
    >(`${API_PATH}/listing`, dataFrom);
    return res;
  } catch (err: unknown) {
    log('failed to post Marketplace Btc List NFT', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to post Marketplace Btc List NFT');
  }
};

export interface IGetMarketplaceBtcNFTDetail {
  inscriptionID: string;
  price: string;
  name: string;
  description: string;
  orderID: string;
}

export const getMarketplaceBtcNFTDetail = async (
  inscriptionID: string
): Promise<IGetMarketplaceBtcNFTDetail> => {
  try {
    const res = await get<IGetMarketplaceBtcNFTDetail>(
      `${API_PATH}/nft-detail/${inscriptionID}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get MarketplaceBtc NFT Detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get MarketplaceBtc NFT Detail');
  }
};

export interface ISubmitBTCAddressResponse {
  receiveAddress: string;
  timeoutAt: string;
}

export interface ISubmitBTCAddressPayload {
  walletAddress: string;
  inscriptionID: string;
  orderID: string;
}

export const submitAddressBuyBTC = async (
  payload: ISubmitBTCAddressPayload
): Promise<ISubmitBTCAddressResponse> => {
  try {
    const res = await post<ISubmitBTCAddressPayload, ISubmitBTCAddressResponse>(
      `${API_PATH}/nft-gen-order`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to submit MarketplaceBtc Address', LogLevel.ERROR, LOG_PREFIX);
    const message =
      typeof err === 'string'
        ? err || ''
        : 'Failed to submit MarketplaceBtc Address';
    throw Error(message);
  }
};
