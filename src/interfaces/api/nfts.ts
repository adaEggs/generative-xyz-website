import { NFTHolder } from '@interfaces/nft';
import { IPagingParams, IPagingResponse } from './paging';
import { TokenActivity } from '@interfaces/token';

export interface IGetTokenActivitiesParams {
  contractAddress: string;
  // tokenID: string;
  inscriptionID: string;
}

export interface IGetTokenActivitiesQuery extends IPagingParams {
  inscription_id?: string;
  project_id?: string;
  types?: string;
}

export interface IGetTokenActivitiesResponse extends IPagingResponse {
  result: Array<TokenActivity>;
}

export interface IGetNFTHolderListParams extends IPagingParams {
  contractAddress: string;
}

export interface IGetNFTHolderListResponse {
  result: Array<NFTHolder>;
}
