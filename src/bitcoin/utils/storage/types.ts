import { UTXO } from 'generative-sdk';
import { ITxHistory, TrackTxType } from '@interfaces/api/bitcoin';

export interface ISetPendingUTXOsPayload {
  utxos: UTXO[];
  trAddress: string;
}

export interface IGetPendingUTXOsPayload {
  trAddress: string;
}

export interface IFilterPendingUTXOsPayload {
  trAddress: string;
  history: ITxHistory[];
  utxos: UTXO[];
}

export interface IPendingUTXO extends UTXO {
  createdTime: string;
  txIDKey: string;
  type: TrackTxType;
}
