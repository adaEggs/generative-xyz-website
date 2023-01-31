import { NFTHolder } from '@interfaces/nft';
import { IPagingParams } from './paging';

export interface IGetTokenActivitiesParams {
  contractAddress: string;
  tokenID: string;
}

export interface IGetTokenActivitiesResponse {
  updated_at: string;
  items: {
    nft_transactions: Array<unknown>;
    [x: string]: unknown;
  }[];
  pagination: unknown;
}

export interface IGetNFTHolderListParams extends IPagingParams {
  contractAddress: string;
}

export interface IGetNFTHolderListResponse {
  result: Array<NFTHolder>;
}
