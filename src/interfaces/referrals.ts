import { ProjectSocial } from './project';

export interface Referral {
  id: string;
  walletAddress: string;
  walletAddressBtc: string;
  walletAddressBtcTaproot: string;
  displayName: string;
  bio: string;
  avatar: string;
  createdAt: string;
  profileSocial: ProjectSocial;
  volume?: string;
}
