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

export enum ProposalStatus {
  Voting = 0,
  Executed = 1,
  Defeated = 2,
}

export enum ProposalUserStatus {
  Verifying = 0,
  Verified = 1,
}
