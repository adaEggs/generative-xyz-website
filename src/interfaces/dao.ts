import { ProposalState } from '@enums/dao';
import { TokenType } from '@enums/token-type';

export interface IFormValue {
  title: string;
  description: string;
  tokenType: TokenType;
  amount: string;
  receiverAddress: string;
}

export type Proposal = {
  id: string;
  title: string;
  amount: string;
  calldatas: string | null;
  description: string;
  startBlock: number;
  endBlock: number;
  isDraft: boolean;
  proposalID: string;
  proposer: string;
  receiverAddress: string;
  state: ProposalState;
  targets: null;
  values: string | null;
  tokenType: TokenType;
};
