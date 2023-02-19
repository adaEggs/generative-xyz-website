import { IMAGE_TYPE } from '@components/NFTDisplayBox/constant';

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

export interface ISubmitBTCAddressResponse {
  receiveAddress: string;
  timeoutAt: string;
}

export interface ISubmitBTCAddressPayload {
  walletAddress: string;
  inscriptionID: string;
  orderID: string;
}

export interface IListingFeePayload {
  inscriptionID: string;
}

export interface IListingFee {
  serviceFee: number;
  royaltyFee: number;
}

export interface IListingordinals {
  inscriptions: string[];
  prev: number;
  next: number;
  data: IGetMarketplaceBtcListItem[];
}

export interface IInscriptionDetailResp {
  content_type: IMAGE_TYPE;
  inscription_id: string;
  number: number;
}

export interface IFilterInfoItem {
  name: string;
  count: number;
  value: string;
  from: number;
  to: number;
}

export interface IFilterInfoDetail {
  name: string;
  data: IFilterInfoItem[];
}

export type FilterName = 'collection' | 'inscriptionID' | 'price';

export enum FilterKey {
  collection = 'collection',
  inscriptionID = 'inscriptionID',
  price = 'price',
}

export type FilterKeyType = FilterKey;

export interface IFilterInfo {
  [FilterKey.collection]: IFilterInfoDetail | undefined;
  [FilterKey.inscriptionID]: IFilterInfoDetail | undefined;
  [FilterKey.price]: IFilterInfoDetail | undefined;
}

export interface IGetFilterDataParams {
  collections: string[];
  inscriptionIDs: string[];
  prices: string[];
  keyword?: string;
}
