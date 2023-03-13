export interface ICreateFCMTokenPayload {
  device_type: string;
  registration_token: string;
}

export interface ICreateFCMTokenResponse {
  token: string;
}
