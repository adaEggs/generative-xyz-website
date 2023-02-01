import { VoteType } from '@enums/dao';
import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface ICastVoteProposalParams
  extends ContractOperationRequiredParams {
  proposalId: string;
  support: VoteType;
}
