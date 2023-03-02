import { UTXO } from 'generative-sdk';
import { ITxHistory, TrackTxType } from '@interfaces/api/bitcoin';

export interface ISetPendingUTXO {
  utxos: UTXO[];
  address: string; // taproot address
}

export interface IGetPendingUTXO {
  address: string; // taproot address
}

export interface IFilterPendingUTXO {
  address: string; // taproot address
  history: ITxHistory[];
}

export interface IStorageUTXO extends UTXO {
  createdTime: string;
  txIDKey: string;
  type: TrackTxType;
}
