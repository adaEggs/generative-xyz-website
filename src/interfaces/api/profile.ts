import { IMAGE_TYPE } from '@components/NFTDisplayBox/constant';
import { IPagingResponse } from '@interfaces/api/paging';
import { ProjectSocial } from '@interfaces/project';
import { User } from '@interfaces/user';

export type IGetProfileResponse = User;

export interface IUpdateProfilePayload {
  avatar?: string | ArrayBuffer | null;
  bio?: string;
  displayName?: string;
  profileSocial?: ProjectSocial;
  walletAddressBtc?: string;
}
export interface IUpdateProfileResponse {
  avatar: string;
  bio: string;
  createdAt: string;
  displayName: string;
  id: string;
  profileSocial: ProjectSocial;
  walletAddress: string;
  walletAddressBtc: string;
}

export interface IGetArtistsResponse extends IPagingResponse {
  result: Array<User>;
}

// Collected tab

export enum CollectedNFTStatus {
  Minting = 'minting',
  Success = 'success',
}
export interface ICollectedNFTItem {
  inscriptionID?: string;
  name: string;
  image: string;
  projectName?: string;
  projectID?: string;
  orderID?: string;
  isCompleted: boolean;
  inscriptionNumber?: string;
  contentType?: IMAGE_TYPE;
  contentLength?: string;
  status: CollectedNFTStatus;
  statusText: string;
}

export interface IGetMintingCollectedNFTResp {
  status: string;
  projectName: string;
  projectID: string;
  projectImage: string;
  fileURI: string;
}

export interface IGetCollectedNFTInsciption {
  inscription_id: string;
  offset: number;
  number: number;
  content_type: string;
  project_id: string;
  project_name: string;
  thumbnail: string;
}

export interface IGetCollectedNFTsResp {
  inscriptions: Array<IGetCollectedNFTInsciption>;
}

export interface IInscriptionResp {
  content_type: IMAGE_TYPE;
  inscription_id: string;
  number: number;
}
