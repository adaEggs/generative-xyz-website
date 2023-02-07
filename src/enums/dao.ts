export enum CreateProposalDisplayMode {
  INPUT_INFO = 'INPUT_INFO',
  PREVIEW = 'PREVIEW',
}

export enum VoteType {
  AGAINST = 0,
  FOR = 1,
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}
