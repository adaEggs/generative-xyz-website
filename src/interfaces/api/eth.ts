export interface IGenerateReceiverAddressPayload {
  walletAddress: string;
  projectID: string;
}

export interface IGenerateReceiverAddressResponse {
  address: string;
  price: string;
}

export interface IMintGenerativePayload {
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
