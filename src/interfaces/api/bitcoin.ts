import * as GENERATIVE_SDK from 'generative-sdk';

export interface IInscriptionByOutputValue {
  offset: number;
  id: string;
}
export interface IInscriptionByOutput {
  [key: string]: IInscriptionByOutputValue[];
}

export interface ICollectedUTXOResp {
  address: string;
  inscription_id: string;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  txrefs: GENERATIVE_SDK.UTXO[];
  inscriptions_by_outputs: IInscriptionByOutput;
}

export enum FeeRateName {
  fastestFee = 'fastestFee',
  halfHourFee = 'halfHourFee',
  hourFee = 'hourFee',
}

export interface IFeeRate {
  [FeeRateName.fastestFee]: number;
  [FeeRateName.halfHourFee]: number;
  [FeeRateName.hourFee]: number;
}

export enum TrackTxType {
  normal = 'normal',
  inscription = 'inscription',
  buyInscription = 'buy-inscription',
  buySplit = 'buy-split-inscription',
  listSplit = 'list-split-inscription',
  list = 'list-inscription',
  cancel = 'cancel-list-inscription',
}

export interface ITrackTx {
  address: string;
  receiver: string;
  type: TrackTxType;
  inscription_id: string;
  inscription_number: number;
  send_amount: number;
  txhash: string;
}

export enum HistoryStatusType {
  pending = 'Pending',
  failed = 'Failed',
  success = 'Success',
}

export type HistoryStatusColor = '#ff7e21' | '#24c087' | '#ff4747';

export interface ITxHistory {
  txhash: string;
  status: HistoryStatusType;
  statusColor: HistoryStatusColor;
  type: TrackTxType;
  inscription_id: string;
  inscription_number: number;
  send_amount: number;
  created_at: string;
  isExpired: boolean;
}

export interface ITxHistory {
  txhash: string;
  status: HistoryStatusType;
  statusColor: HistoryStatusColor;
  type: TrackTxType;
  inscription_id: string;
  inscription_number: number;
  send_amount: number;
  created_at: string;
  isExpired: boolean;

  // order_id: '6401acf76d1254300140c056';
  // type: 'cancelling';
  // timestamp: 1677836116;
  // inscription_id: '9a6a37681c0ad4326e8f30e75359bb4cb6627b4a515d8c317ffae5d42d5c39d1i0';
  // txhash: '431630d7f5f1bdbf37eb82462ab65a30fd9f0226e5d94817511b3dee20acc601';
  // amount: '10000';
}

export interface IListingPayload {
  raw_psbt: string; // base64
  inscription_id: string;
}

export interface IRetrieveOrderPayload {
  orderID: string;
}

export interface IRetrieveOrderResp {
  raw_psbt: string;
}
