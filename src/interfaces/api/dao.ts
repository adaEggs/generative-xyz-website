import { Proposal } from '@interfaces/dao';

export interface ICreateProposalPayload {
  title: string;
  description: string;
}

export interface ICreateProposalResponse extends Proposal {
  createdAt: string;
}
