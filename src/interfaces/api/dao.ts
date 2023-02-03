import { TokenType } from '@enums/token-type';
import { Proposal } from '@interfaces/dao';
import { IPagingParams } from './paging';

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
}
