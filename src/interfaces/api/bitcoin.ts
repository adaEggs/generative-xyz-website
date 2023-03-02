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
  listSplitInscription = 'list-split-inscription',
  listInscription = 'list-inscription',
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
  type: ITrackTx;
  inscription_id: string;
  inscription_number: number;
  send_amount: number;
  created_at: string;
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
