import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';
import { getOrdContentByInscriptionID } from '@utils/parseOrdHTML';

const LOG_PREFIX = 'MarketplaceBtcService';

const API_PATH = '/marketplace-btc';

// ------------------------------------------------
// LISTING SITE
// ------------------------------------------------
export interface IGetMarketplaceBtcListParams {
  limit: number;
  offset: number;
  'buyable-only': boolean;
}
export interface IGetMarketplaceBtcListItem {
  inscriptionID: string;
  price: string;
  name: string;
  description: string;
  image: string;
  orderID: string;
  buyable: boolean;
  isCompleted: boolean;
  index: string;
}
export const getMarketplaceBtcList = async (
  params: IGetMarketplaceBtcListParams
): Promise<IGetMarketplaceBtcListItem[]> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetMarketplaceBtcListItem[]>(
      `${API_PATH}/list${qs}`
    );
    const tasks = res.map(async data => {
      const inscriptionID = data.inscriptionID;
      const { index } = await getOrdContentByInscriptionID(inscriptionID);
      return {
        ...data,
        index,
      };
    });
    return Promise.all(tasks);
  } catch (err: unknown) {
    log('failed to get Marketplace Btc List', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Btc List');
  }
};
export interface IListingFeePayload {
  inscriptionID: string;
}
export interface IListingFee {
  serviceFee: number;
  royaltyFee: number;
}
export const getListingFee = async (
  payload: IListingFeePayload
): Promise<IListingFee> => {
  try {
    const res = await post<IListingFeePayload, IListingFee>(
      `${API_PATH}/listing-fee`,
      payload
    );
    return {
      royaltyFee: Number(res.royaltyFee || 0),
      serviceFee: Number(res.serviceFee || 0),
    };
  } catch (err: unknown) {
    log('failed to get get fee', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get fee');
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
    return post<
      IPostMarketplaceBtcListNFTParams,
      IPostMarketplaceBtcListNFTResponse
    >(`${API_PATH}/listing`, dataFrom);
  } catch (err: unknown) {
    log('failed to post Marketplace Btc List NFT', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to post Marketplace Btc List NFT');
  }
};

// ------------------------------------------------
// TOKEN DETAIL
// ------------------------------------------------
export interface IGetMarketplaceBtcNFTDetail {
  inscriptionID: string;
  price: string;
  name: string;
  description: string;
  orderID: string;
  buyable: boolean;
  isCompleted: boolean;
  index: string;
}
export const getMarketplaceBtcNFTDetail = async (
  inscriptionID: string
): Promise<IGetMarketplaceBtcNFTDetail> => {
  try {
    const [res, data] = await Promise.all([
      await get<IGetMarketplaceBtcNFTDetail>(
        `${API_PATH}/nft-detail/${inscriptionID}`
      ),
      await getOrdContentByInscriptionID(inscriptionID),
    ]);
    return {
      ...res,
      index: data.index,
    };
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
    return post<ISubmitBTCAddressPayload, ISubmitBTCAddressResponse>(
      `${API_PATH}/nft-gen-order`,
      payload
    );
  } catch (err: unknown) {
    log('failed to submit MarketplaceBtc Address', LogLevel.ERROR, LOG_PREFIX);
    const message =
      typeof err === 'string'
        ? err || ''
        : 'Failed to submit MarketplaceBtc Address';
    throw Error(message);
  }
};

// ------------------------------------------------
// COLLECTION
// ------------------------------------------------
export interface IGetCollectionBtcListParams {
  limit: number;
  offset: number;
  'buyable-only': boolean;
}
export interface IGetCollectionBtcListItem {
  name: string;
  total: string;
  inscriptionID: string;
}
export const getCollectionBtcList = async (
  params: IGetCollectionBtcListParams
): Promise<IGetCollectionBtcListItem[]> => {
  try {
    return [
      {
        name: 'Ordinal Shards',
        total: '100',
        inscriptionID:
          '93c3bc43274241958f61565a58ed043128d6f54db564508cbe9956e9096275aei0',
      },
      {
        name: 'Planetary Ordinals',
        total: '69',
        inscriptionID:
          'af0b19432a676551223e300e7197348b7c225cb7b31d0d7c6e246e382cbf6f81i0',
      },
    ];
    const qs = '?' + querystring.stringify(params);
    return get<IGetCollectionBtcListItem[]>(`${API_PATH}/collection${qs}`);
  } catch (err: unknown) {
    log('failed to get Marketplace Btc List', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Btc List');
  }
};
