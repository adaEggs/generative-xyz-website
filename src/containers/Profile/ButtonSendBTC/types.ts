import { UTXO } from 'generative-sdk';

export interface IStorageUTXO extends UTXO {
  createdTime: string;
  txIDKey: string;
}
