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
  receiverBTCAddress: string;
  amountPayToSeller: number;
  feePayToCreator: number;
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
