import { UTXO } from 'generative-sdk';
import { ITxHistory, TrackTxType } from '@interfaces/api/bitcoin';

export interface ISetPendingUTXOsPayload {
  utxos: UTXO[];
  trAddress: string;
  txHash: string;
}

export interface IGetPendingUTXOsPayload {
  trAddress: string;
}

export interface IFilterPendingUTXOsPayload {
  trAddress: string;
  history: ITxHistory[] | undefined;
  utxos: UTXO[] | undefined;
}

export interface IPendingUTXO extends UTXO {
  createdTime: string;
  txIDKey: string;
  type: TrackTxType;
  txHash: string;
}
