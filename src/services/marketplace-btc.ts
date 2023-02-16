import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';
import { IMAGE_TYPE } from '@components/NFTDisplayBox/constant';

const LOG_PREFIX = 'MarketplaceBtcService';

const API_PATH = '/marketplace-btc';
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
  inscriptionNumber: string;
  contentType: IMAGE_TYPE;
  contentLength: string;
}
export const getMarketplaceBtcList = async (
  params: IGetMarketplaceBtcListParams
): Promise<IGetMarketplaceBtcListItem[]> => {
  try {
    const qs = '?' + querystring.stringify(params);
    return get<IGetMarketplaceBtcListItem[]>(`${API_PATH}/list${qs}`);
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
  buyable: boolean;
  isCompleted: boolean;
  inscriptionNumber: string;
  contentType: IMAGE_TYPE;
  contentLength: string;
}

export const getMarketplaceBtcNFTDetail = async (
  inscriptionID: string
): Promise<IGetMarketplaceBtcNFTDetail> => {
  try {
    return get<IGetMarketplaceBtcNFTDetail>(
      `${API_PATH}/nft-detail/${inscriptionID}`
    );
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

export interface IListingordinals {
  inscriptions: string[];
  prev: number;
  next: number;
  data: IGetMarketplaceBtcListItem[];
}
const HOST_ORDINALS_EXPLORER =
  'https://ordinals-explorer-v5-dev.generative.xyz';

export const getListingOrdinals = async (
  from: string | number = 0
): Promise<IListingordinals> => {
  try {
    const res = await fetch(
      `${HOST_ORDINALS_EXPLORER}/api/inscriptions${
        from !== 0 ? `/${from}` : ''
      }`
    );
    const dataRes = await res.json();
    const tasks = dataRes.inscriptions.map(async (inscriptionID: string) => {
      return getInscriptionDetail(inscriptionID);
    });
    const data = await Promise.all(tasks);
    return {
      ...dataRes,
      data,
    };
  } catch (err: unknown) {
    log('failed to get get fee', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get fee');
  }
};

interface IInscriptionDetailResp {
  content_type: IMAGE_TYPE;
  inscription_id: string;
  number: number;
}

export const getInscriptionDetail = async (
  inscriptionID: string
): Promise<IGetMarketplaceBtcListItem> => {
  try {
    const res = await fetch(
      `${HOST_ORDINALS_EXPLORER}/api/inscription/${inscriptionID}`
    );
    const dataRes: IInscriptionDetailResp = await res.json();
    const randomStr = Date.now().toString();
    return {
      inscriptionID,
      inscriptionNumber: `${dataRes.number}`,
      contentType: dataRes.content_type,
      name: randomStr,
      orderID: randomStr,
      buyable: false,
      isCompleted: false,
      price: '',
      description: '',
      image: '',
      contentLength: randomStr,
    };
  } catch (err: unknown) {
    log('failed to get get fee', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get fee');
  }
};
