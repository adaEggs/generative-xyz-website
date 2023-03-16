import { IGetTokenActivitiesResponse } from './api/nfts';
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
  inscriptionIndex: string;
  buyable: boolean;
  isCompleted: boolean;
  priceBTC: string;
  priceETH: string;
  orderInscriptionIndex: string;
  orderID: string;
  projectID?: string;
  projectName?: string;
  stats: {
    price: string;
  };
  animationHtml: string;
  listingDetail?: {
    paymentListingInfo: {
      btc: {
        paymentAddress: string;
        price: string;
      };
      eth?: {
        paymentAddress: string;
        price: string;
      };
    };
  };

  ordinalsData?: {
    sat: string;
    contentLength: string;
    contentType: string;
    timestamp: string;
    block: string;
  };
  nftTokenId?: string;
  sell_verified: boolean;
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
  buyerInfo?: User;
};

export type TokenActivities = IGetTokenActivitiesResponse;

export type TokenActivity = {
  type: number;
  title: string;
  user_a_address: string;
  user_a: User;
  user_b_address: string;
  user_b: User;
  amount: number;
  time: string;
  token_info: Token;
};
