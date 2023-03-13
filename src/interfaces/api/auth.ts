export interface IGenerativeNonceMessagePayload {
  address: string;
}

export interface IGenerativeNonceMessageResponse {
  message: string;
}

export interface IVerifyNonceMessagePayload {
  signature: string;
  messagePrefix: string;
  address: string;
  addressBtc: string; // taproot
  addressBtcSegwit: string;
  ethSignature: string;
}

export interface IVerifyNonceMessageResponse {
  accessToken: string;
  refreshToken: string;
  isVerified: boolean;
}
