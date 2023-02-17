export interface IGenerativeNonceMessagePayload {
  address: string;
}

export interface IGenerativeNonceMessageResponse {
  message: string;
}

export interface IVerifyNonceMessagePayload {
  signature: string;
  messagePrefix: string;
  addressBtc: string;
  addressBtcTaproot: string;
}

export interface IVerifyNonceMessageResponse {
  accessToken: string;
  refreshToken: string;
  isVerified: boolean;
}
