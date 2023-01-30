export interface IGetTokenActivitiesParams {
  contractAddress: string;
  tokenID: string;
}

export interface IGetTokenActivitiesResponse {
  updated_at: string;
  items: {
    nft_transactions: Array<unknown>;
    [x: string]: unknown;
  }[];
  pagination: unknown;
}
