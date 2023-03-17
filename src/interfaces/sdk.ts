import {
  ICreateTxResp,
  UTXO,
  ICreateTxBuyResp,
  ICreateTxSellResp,
  BuyReqInfo,
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

// Amount validator
interface IAmountValidatorReq {
  feeRate: number;
  assets: ICollectedUTXOResp | undefined;
  amount: string;
  inscriptionID?: string;
}

// Buy multiple inscription
type IBuyMulInsBTCResp = ICreateTxBuyResp;
interface IBuyMulInsBTCReq {
  buyInfos: BuyReqInfo[];
  privateKey: Buffer;
  utxos: UTXO[];
  inscriptions: IInscriptionByOutput;
  feeRate: number;
}

// Estimate fee
interface IEstimateTxFeeReq {
  numIn: number;
  numOut: number;
  feeRate: number | string;
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
  IBuyMulInsBTCResp,
  IBuyMulInsBTCReq,
  IEstimateTxFeeReq,
};
