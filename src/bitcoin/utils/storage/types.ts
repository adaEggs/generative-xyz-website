import { UTXO } from 'generative-sdk';

export interface ISetPendingUTXOsPayload {
  utxos: UTXO[];
  trAddress: string;
  txHash: string;
}

export interface IGetPendingUTXOsPayload {
  trAddress: string;
}

export interface IFilterAvailableUTXOsPayload {
  trAddress: string;
  utxos: UTXO[] | undefined;
}

export interface IPendingUTXO extends UTXO {
  createdTime: string;
  txIDKey: string;
  txHash: string;
}
