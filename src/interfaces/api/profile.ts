import { IMAGE_TYPE } from '@components/NFTDisplayBox/constant';
import { ProjectSocial } from '@interfaces/project';
import { User } from '@interfaces/user';

export type IGetProfileResponse = User;

export interface IUpdateProfilePayload {
  avatar?: string | ArrayBuffer | null;
  bio?: string;
  displayName?: string;
  profileSocial?: ProjectSocial;
  walletAddressBtc?: string;
  walletAddressPayment: string;
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

// Collected tab

export enum CollectedNFTStatus {
  Minting,
  Success,
}
export interface ICollectedNFTItem {
  id?: string;
  inscriptionID?: string;
  name: string;
  image: string;
  projectName?: string;
  projectID?: string;
  inscriptionNumber?: string;
  contentType?: IMAGE_TYPE;
  isCancel: boolean;
  status: CollectedNFTStatus;
  statusText: string;
  receiveAddress?: string;
}

export interface ICollectedNFTItemDetail extends ICollectedNFTItem {
  progressStatus?: {
    [key: string]: { message: string; tx?: string; status: boolean };
  };
}

export interface IGetMintingCollectedNFTResp {
  status: string;
  isCancel: boolean;
  projectName: string;
  projectID: string;
  projectImage: string;
  fileURI: string;
  inscriptionID: string;
  id: string;
  receiveAddress: string;
}

export interface IGetCollectedNFTInsciptionResp {
  id: string;
  inscription_id: string;
  offset: number;
  number: number;
  content_type: string;
  project_id: string;
  project_name: string;
  thumbnail: string;
}

export interface IGetCollectedNFTsResp {
  inscriptions: Array<IGetCollectedNFTInsciptionResp>;
}

export interface IWithdrawRefereeRewardPayload {
  amount: string;
  paymentType: string;
  type: string;
  id: string;
}

export interface IApikey {
  uuid: string;
  apiKey: string;
  apiName: string;
  apiEmail: string;
  apiCompany: string;
  apiDescription: string;
  status?: boolean;
}

export interface IApikeyResponse {
  UserUuid: string;
  ApiKey: string;
  ApiName: string;
  ApiEmail: string;
  ApiCompany: string;
  ApiDescription: string;
  Status?: boolean;
}
