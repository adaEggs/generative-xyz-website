import { BuyReqInfo } from 'generative-sdk';

export interface ISendInsProps {
  receiverAddress: string;
  feeRate: number;
  inscriptionNumber: number;
}

export interface ISendBTCProps {
  receiverAddress: string;
  feeRate: number;
  amount: number;
}

export interface IBuyInsProps {
  feeRate: number;
  price: number;
  receiverInscriptionAddress: string;
  sellerSignedPsbtB64: string;
  inscriptionNumber: number;
}

export interface IListInsProps {
  receiver: string;
  paySeller: string;
  payCreator: string;
  creatorAddress: string;
  feeRate: number;
  inscriptionNumber: number;
}

export interface ICancelInsProps {
  receiverAddress: string;
  feeRate: number;
  inscriptionNumber: number;
  orderID: string;
}

export interface ISignKeyResp {
  privateKey: Buffer;
  tpAddress: string;
  evmAddress: string;
}

export interface IBuyMulInsProps {
  feeRate: number;
  price: number;
  receiver: string;
  buyInfos: BuyReqInfo[];
}
