import {
  ICreateTxResp,
  UTXO,
  ICreateTxBuyResp,
  ICreateTxSellResp,
} from 'generative-sdk';
import {
  ICollectedUTXOResp,
  IInscriptionByOutput,
} from '@interfaces/api/bitcoin';

// Send Inscription
type ISendInsResp = ICreateTxResp;
type ISendInsReq = {
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  inscriptionID: string;
  receiver: string;
  amount?: string;
  feeRate: number;
};

// Send BTC
type ISendBTCResp = ICreateTxResp;
interface ISendBTCReq {
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  receiver: string;
  amount: string | number;
  feeRate: number;
}

// Buy Inscription
type IBuyInsBTCResp = ICreateTxBuyResp;
interface IBuyInsBTCReq {
  psbtB64: string;
  privateKey: Buffer;
  receiver: string;
  price: string | number;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  feeRate: number;
}

// List for sale
type ISellInsResp = ICreateTxSellResp;
interface ISellInsReq {
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  inscriptionID: string;
  receiver: string;
  paySeller: string;
  payCreator: string;
  creatorAddress: string;
  feeRate: number;
}

interface IAmountValidatorReq {
  feeRate: number;
  assets: ICollectedUTXOResp | undefined;
  amount: string;
  inscriptionID?: string;
}

export type {
  ISendInsResp,
  ISendInsReq,
  ISendBTCResp,
  ISendBTCReq,
  IBuyInsBTCResp,
  IBuyInsBTCReq,
  ISellInsResp,
  ISellInsReq,
  IAmountValidatorReq,
};
