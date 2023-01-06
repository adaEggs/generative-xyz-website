import { IPagingResponse } from '@interfaces/paging';
import { TokenOffer } from '@interfaces/token';

export interface IListingTokensResponse extends IPagingResponse {
  result: TokenOffer[];
}

export interface ITokenOfferListResponse extends IPagingResponse {
  result: TokenOffer[];
}

export interface IMarketplaceStatsResponse {
  floorPrice: string;
  volume: string;
}
