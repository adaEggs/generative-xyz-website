export interface IGenerativeNonceMessagePayload {
  address: string;
}

export interface IGenerativeNonceMessageResponse {
  message: string;
}

export interface IVerifyNonceMessagePayload {
  address: string;
  signature: string;
  addressBtc: string;
  message: string;
  pubkey: string;
}

export interface IVerifyNonceMessageResponse {
  accessToken: string;
  refreshToken: string;
  isVerified: boolean;
}
