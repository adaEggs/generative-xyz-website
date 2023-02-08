import { ProposalState, VoteType } from '@enums/dao';
import { TokenType } from '@enums/token-type';

export interface IFormValue {
  title: string;
  description: string;
  tokenType: TokenType;
  amount: string;
  receiverAddress: string;
}

export type ProposalVote = {
  for: number;
  against: number;
  total: number;
  percentFor: number;
  percentAgainst: number;
};

export type Vote = {
  id: string;
  proposalID: string;
  voter: string;
  support: VoteType;
  weight: string;
  reason: string;
  createdAt: string;
};

export type Proposal = {
  id: string;
  title: string;
  amount: string;
  calldatas: Array<string> | null;
  description: string;
  startBlock: number;
  endBlock: number;
  currentBlock: number;
  isDraft: boolean;
  vote: ProposalVote;
  proposalID: string;
  proposer: string;
  receiverAddress: string;
  state: ProposalState;
  targets: null;
  values: string | null;
  tokenType: TokenType;
  createdAt: string;
};
