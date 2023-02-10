export interface IGenerateReceiverAddressPayload {
  walletAddress: string;
  projectID: string;
}

export interface IGenerateReceiverAddressResponse {
  address: string;
  price: string;
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

export interface IGenerateReceiverAddressV2Payload {
  walletAddress: string;
  file: string; // Base64
  name: string;
}

export interface IGenerateReceiverAddressV2Response {
  id: string;
  userAddress: string;
  amount: string;
  mintFee: string;
  sentTokenFee: string;
  ordAddress: string;
  fileURI: string;
  isConfirm: boolean;
  inscriptionID: string;
  balance: string;
}
