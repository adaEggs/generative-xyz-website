import { IPagingParams, IPagingResponse } from '@interfaces/api/paging';
import { BTCProject, Project } from '@interfaces/project';
import { Token } from '@interfaces/token';

export interface IGetProjectDetailParams {
  contractAddress: string;
  projectID: string;
}

export type IGetProjectDetailResponse = Project;

export interface IGetProjectItemsParams {
  contractAddress: string;
}

export interface IGetProjectItemsQuery extends IPagingParams {
  name?: string;
  sort?: string;
  attributes?: string;
  minPrice?: string;
  maxPrice?: string;
  tokenID?: string;
  keyword?: string;
  has_price?: true | '';
  from_price?: string;
  to_price?: string;
}

export interface IGetProjectItemsResponse extends IPagingResponse {
  result: Project[];
}

export interface IGetProjectTokensResponse extends IPagingResponse {
  result: Token[];
}

export interface ICreateProjectMetadataPayload {
  categories: Array<string>;
  contractAddress: string;
  tags: Array<string>;
  tokenID: string;
}

export type ICreateProjectMetadataResponse = IGetProjectDetailResponse;

export interface IGetProjectListParams extends IPagingParams {
  contractAddress: string;
  category?: string[];
  sort?: string;
  name?: string;
}

export interface IGetProjectListResponse extends IPagingResponse {
  result: Array<Project>;
}

export interface ICreateBTCProjectPayload {
  categories: Array<string>;
  closeMintUnixTimestamp: number;
  // creatorAddrrBTC: string;
  description: string;
  license: string;
  limitSupply: number;
  maxSupply: number;
  mintPrice: string;
  name: string;
  openMintUnixTimestamp: number;
  scripts: Array<string>;
  socialDiscord: string;
  socialInstagram: string;
  socialMedium: string;
  socialTwitter: string;
  socialWeb: string;
  styles: string;
  tags: Array<string>;
  thirdPartyScripts: Array<string>;
  thumbnail: string;
  tokenDescription: string;
  zipLink: string;
  royalty: number;
  animationURL: string;
  isFullChain: boolean;
}

export type ICreateBTCProjectResponse = BTCProject;

export interface IUploadBTCProjectFilePayload {
  file: File;
  projectName: string;
}

export interface IUploadBTCProjectFileResponse {
  fileName: string;
  fileSize: number;
  id: string;
  mimeType: string;
  uploadedBy: string;
  url: string;
}

export type IUpdateProjectPayload = Pick<
  ICreateBTCProjectPayload,
  'name' | 'description' | 'thumbnail' | 'royalty' | 'mintPrice' | 'maxSupply'
> & { isHidden: boolean; categories: string[] };

export interface IReportProjectPayload {
  // projectID: string;
  originalLink?: string;
}
export type IReportProjectResponse = Project;
