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
