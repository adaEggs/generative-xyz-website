import { ProjectSocial } from './project';

export type User = {
  displayName: string;
  bio: string;
  avatar: string;
  walletAddress: string;
  id: string;
  createdAt: string;
  profileSocial?: ProjectSocial;
  bgCover?: string;
  walletAddressBtc?: string;
  walletAddressBtcTaproot?: string;
  projects?: { name: string; projectId: string }[];
  walletAddressPayment?: string;
};
