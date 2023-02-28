import { InscriptionInfo, InscriptionItem } from '@interfaces/inscribe';
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
