export type IPaymentType = 'btc' | 'eth';

export interface IGetMintReceiverAddressPayload {
  walletAddress: string;
  projectID: string;
  payType: IPaymentType;
  refundUserAddress?: string;
  quantity: number;
  feeRate?: number;
}

export interface IGetMintReceiverAddressResp {
  address: string;
  price: string;
  payType: IPaymentType;
  networkFeeByPayType: string;
  mintPriceByPayType: string;
}

export interface IMintGenerativePayload {
  // ORD_WALLET_ADDRESS
  address: string;
}

export interface IMintGenerativePayloadResponse {
  id: string;
  user_address: string;
  ordAddress: string;
  amount: number;
  fileURI: string;
  isConfirm: boolean;
  inscriptionID: string;
}
