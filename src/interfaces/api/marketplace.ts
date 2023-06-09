import { IPagingParams } from './paging';
import { IMakeOffers, MarketplaceStats } from '@interfaces/marketplace';
import { IPagingResponse } from '@interfaces/api/paging';
import { TokenOffer } from '@interfaces/token';

export interface IListingTokensResponse extends IPagingResponse {
  result: TokenOffer[];
}

export interface ITokenOfferListResponse extends IPagingResponse {
  result: TokenOffer[];
}

export interface IMarketplaceStatsResponse {
  stats: MarketplaceStats;
}

export type IMakeOffersParams = IMakeOffers;

export interface IMakeOffersQuery extends IPagingParams {
  closed?: boolean;
  finished?: boolean;
  sort_by: string;
  sort?: 1 | -1;
}

export interface IProfileActivityResponse extends IPagingResponse {
  result: TokenOffer[];
}
