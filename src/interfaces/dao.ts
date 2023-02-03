import { TokenType } from '@enums/token-type';

export interface IFormValue {
  title: string;
  description: string;
  tokenType: TokenType;
  amount: string;
  receiverAddress: string;
}

export type Proposal = {
  title: string;
};
