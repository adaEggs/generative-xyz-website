import { MoralisNFT } from "@interfaces/inscribe";
import { IPagingParams } from "./paging";

export interface IGetNFTListFromMoralisParams extends IPagingParams {
  walletAddress?: string;
  cursor?: string; // last id
}

export type IGetNFTListFromMoralisResponse = Record<
  string,
  {
    result: Array<MoralisNFT>;
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
    cursor: string;
  }
>;

export interface IGetNFTDetailFromMoralisParams {
  tokenAddress: string;
  tokenId: string;
}

export interface IGetNFTDetailFromMoralisResponse extends MoralisNFT { }