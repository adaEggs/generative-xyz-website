import { User } from '@interfaces/user';
import { Project } from './project';

export type TokenAttribute = {
  trait_type: string;
  value: string;
};

export type Token = {
  thumbnail?: string;
  name: string;
  description: string;
  image: string;
  animationUrl: string;
  animation_url: string;
  attributes: Array<TokenAttribute>;
  genNFTAddr: string;
  owner: User;
  project: Project;
  mintedTime: string;
  creatorProfile?: User;
  ownerAddr: string;
  creator: User;
  tokenID: string;
};

export type TokenOffer = {
  offeringID: string;
  price: string;
  seller?: string;
  closed: boolean;
  collectionContract: string;
  erc20Token: string;
  finished: boolean;
  durationTime: string;
  token?: Token;
  buyer?: string;
};
