export interface InscriptionInfo {
  amount: string;
  balance: string;
  fileURI: string;
  id: string;
  inscriptionID: string;
  isConfirm: boolean;
  mintFee: string;
  ordAddress: string;
  segwitAddress: string;
  sentTokenFee: string;
  timeout_at: string;
  userAddress: string;
}

export interface InscriptionItem {
  amount: string;
  expiredAt: string;
  feeRate: number;
  fileURI: string;
  inscriptionID: string;
  isConfirm: boolean;
  isMinted: boolean;
  isSuccess: boolean;
  status: number;
  txMintNft: string;
  txSendBTC: string;
  txSendNft: string;
  uuid: string;
  userUuid: string;
}
