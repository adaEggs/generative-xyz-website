import {
  InscriptionInfo,
  InscriptionItem,
  MoralisNFT,
} from '@interfaces/inscribe';
import { IPagingParams } from './paging';

export interface IGenerateReceiverAddressPayload {
  walletAddress: string;
  file: string; // Base64
  fileName: string;
  fee_rate: number;
}

export type IGenerateReceiverAddressResponse = InscriptionInfo;

export type IGetInscriptionListByUserParams = IPagingParams;

export interface IGetInscriptionListByUserResponse {
  page: number;
  pageSize: number;
  result: Array<InscriptionItem>;
  total: number;
}

export interface IGetNFTListFromMoralisParams extends IPagingParams {
  walletAddress?: string;
  cursor?: string; // last id
}

export type IGetNFTListFromMoralisResponse = Record<
  string,
  {
    result: Array<MoralisNFT>;
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
    cursor: string;
  }
>;
