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

export interface MoralisNFT {
  token_address: string;
  token_id: string;
  amount: number;
  owner_of: string;
  token_hash: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: string;
  is_minted: boolean;
  metadata_obj: {
    animation_url: string;
    description: string;
    external_link: string;
    image: string;
    name: string;
  };
}
