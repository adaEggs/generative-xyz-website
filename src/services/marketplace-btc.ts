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
  walletAddress: string;
  inscriptionID: string;
  name: string;
  description: string;
  price: string;
}
export interface IPostMarketplaceBtcListNFTResponse {
  receiveAddress: string;
}
export const postMarketplaceBtcListNFT = async (
  dataFrom: IPostMarketplaceBtcListNFTParams
): Promise<IPostMarketplaceBtcListNFTResponse> => {
  try {
    const res = await post<
      IPostMarketplaceBtcListNFTParams,
      IPostMarketplaceBtcListNFTResponse
    >(`${API_PATH}/nft-gen-order`, dataFrom);
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
}
export interface IGetMarketplaceBtcNFTDetailResponse {
  error: string;
  status: boolean;
  data: IGetMarketplaceBtcNFTDetail;
}
export const getMarketplaceBtcNFTDetail = async (
  inscriptionID: string
): Promise<IGetMarketplaceBtcNFTDetailResponse> => {
  try {
    const res = await get<IGetMarketplaceBtcNFTDetailResponse>(
      `${API_PATH}/nft-detail/${inscriptionID}`
    );
    // const res = {
    //   error: null,
    //   status: true,
    //   data: {
    //     inscriptionID: 'dasdasd',
    //     price: '1231234434',
    //     name: 'abc',
    //     description:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //   },
    // };
    return res;
  } catch (err: unknown) {
    log('failed to get MarketplaceBtc NFT Detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get MarketplaceBtc NFT Detail');
  }
};
