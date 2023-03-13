import { InscribeStatus } from '@enums/inscribe';

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
  timeoutAt: string;
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

export interface IMoralisNFTMetadata {
  animation_url: string;
  description: string;
  external_link: string;
  image: string;
  name: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  glb_url?: string;
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
  metadata_obj: IMoralisNFTMetadata;
  inscribe_btc: {
    inscription_id: string;
    project_token_id: string;
    status: InscribeStatus;
  } | null;
}
