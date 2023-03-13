import { IPagingParams } from './paging';
import { Token, TokenAttribute } from '@interfaces/token';

export interface IGenerativeProjectSocial {
  web: string;
  twitter: string;
  discord: string;
  medium: string;
  instagram: string;
}

export interface IGetGenerativeTokenUriParams {
  contractAddress: string;
  tokenID: string;
  whitelist?: string;
}

export type IGetGenerativeTokenUriResponse = Token;

export interface IGetGenerativeTokenAttributesParams {
  contractAddress: string;
  projectID: string;
}

export interface IGetGenerativeTokenAttributesResponse {
  attributes: Array<TokenAttribute>;
}

export interface IGetProfileTokensResponse {
  result: Array<Token>;
  total: number;
  page: number;
}

export interface IGetGenerativeTokenUriListParams extends IPagingParams {
  search?: string;
  cursor?: string;
}

export type IGetGenerativeTokenUriListResponse = IGetProfileTokensResponse;

export interface ICreateTokenThumbnailPayload {
  tokenID: string;
  thumbnail: string; // Base 64 Image
}
