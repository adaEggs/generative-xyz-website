import { IMAGE_TYPE } from '@components/NFTDisplayBox/constant';
import { ProjectSocial } from '@interfaces/project';
import { User } from '@interfaces/user';
import { IPagingResponse } from '@interfaces/api/paging';

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

export interface IGetCollectedNFTsResp {
  inscriptions: {
    [key: string]: string;
  };
}

export interface IInscriptionResp {
  content_type: IMAGE_TYPE;
  inscription_id: string;
  number: number;
}
