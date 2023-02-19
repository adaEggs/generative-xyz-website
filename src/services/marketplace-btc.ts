import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';
import { HOST_ORDINALS_EXPLORER } from '@constants/config';
import {
  IFilterInfo,
  IGetFilterDataParams,
  IGetMarketplaceBtcListItem,
  IGetMarketplaceBtcListParams,
  IGetMarketplaceBtcNFTDetail,
  IInscriptionDetailResp,
  IListingFee,
  IListingFeePayload,
  IListingordinals,
  IPostMarketplaceBtcListNFTParams,
  IPostMarketplaceBtcListNFTResponse,
  ISubmitBTCAddressPayload,
  ISubmitBTCAddressResponse,
} from '@interfaces/api/marketplace-btc';

const LOG_PREFIX = 'MarketplaceBtcService';

const API_PATH = '/marketplace-btc';

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

export const getListingOrdinals = async (
  from: string | number = 0
): Promise<IListingordinals> => {
  try {
    const url = `${HOST_ORDINALS_EXPLORER}/api/inscriptions${
      from !== 0 ? `/${from}` : ''
    }`;
    const res = await fetch(url);
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
    log('failed to get ordinal detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get ordinal detail');
  }
};

export const getMarketplaceBtcFilterInfo = async (): Promise<IFilterInfo> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await get<any>(`${API_PATH}/filter-info`);
    let data: IFilterInfo = {
      collection: undefined,
      inscriptionID: undefined,
      price: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapObject = (data: any, name: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _items: any = Object.values(data);
      return {
        name,
        data: _items,
      };
    };
    const collection = res?.collection;
    if (collection) {
      data = {
        ...data,
        collection: mapObject(collection, 'Collection'),
      };
    }
    const inscriptionID = res?.inscriptionID;
    if (inscriptionID) {
      data = {
        ...data,
        inscriptionID: mapObject(inscriptionID, 'Inscription ID'),
      };
    }
    const price = res?.price;
    if (price) {
      data = {
        ...data,
        price: mapObject(price, 'Price'),
      };
    }
    return data;
  } catch (err: unknown) {
    log('failed to get Marketplace Filter Info', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Filter Info');
  }
};

export const getFilterData = async ({
  collections,
  prices,
  inscriptionIDs,
  keyword,
}: IGetFilterDataParams): Promise<IGetMarketplaceBtcListItem[]> => {
  try {
    const _collections = collections.join(',');
    const _prices = prices.join(',');
    const _inscriptionIDs = inscriptionIDs.join(',');
    const _keyword = keyword || '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await get<any[]>(
      `${API_PATH}/list?listPrices=${_prices}&listCollectionIDs=${_collections}&keyword=${_keyword}&listIDs=${_inscriptionIDs}`
    );
    let data: IGetMarketplaceBtcListItem[] = [];
    if (res && res.length) {
      data = res.map(item => ({
        inscriptionID: item?.inscriptionID,
        price: item.price,
        name: item.name,
        description: item.description,
        image: '',
        orderID: item.orderID,
        buyable: item.buyable,
        isCompleted: item.isCompleted,
        inscriptionNumber: item.inscriptionNumber,
        contentType: item.contentType,
        contentLength: item.contentLength,
      }));
    }
    return data;
  } catch (err: unknown) {
    log('failed to get Marketplace Filter Data', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get Marketplace Filter Info');
  }
};
