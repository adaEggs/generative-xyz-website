import { VoteType } from '@enums/dao';
import { TokenType } from '@enums/token-type';
import { Proposal, Vote } from '@interfaces/dao';
import { IPagingParams, IPagingResponse } from './paging';

export interface ICreateProposalPayload {
  title: string;
  description: string;
  tokenType: TokenType;
  amount: string;
  receiverAddress: string;
}

export interface ICreateProposalResponse extends Proposal {
  createdAt: string;
}

enum SortType {
  NEWEST = 'newest',
  MINTED_NEWEST = 'minted-newest',
  TOKEN_PRICE_ASC = 'token-price-asc',
  TOKEN_PRICE_DESC = 'token-price-desc',
}

export interface IGetProposalListParams extends IPagingParams {
  proposer?: string;
  sort?: SortType;
  state?: string[];
}

export interface IGetProposalListResponse extends IPagingResponse {
  result: Array<Proposal>;
}

export interface IUpdateProposalIDPayload {
  id: string;
  proposalID: string;
}

export type IUpdateProposalIDResponse = Proposal;

export type IGetProposalByOnChainIDResponse = Proposal;

export interface IGetVoteListParams {
  proposalID: string;
  voter?: string;
  support?: VoteType;
  sort?: SortType;
}

export interface IGetVoteListResponse {
  result: Array<Vote>;
}
