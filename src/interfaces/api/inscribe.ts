import { InscriptionInfo } from '@interfaces/inscribe';

export interface IGenerateReceiverAddressPayload {
  walletAddress: string;
  file: string; // Base64
  name: string;
  fee_rate: number;
}

export type IGenerateReceiverAddressResponse = InscriptionInfo;
