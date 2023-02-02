import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface IExecuteProposalParams
  extends ContractOperationRequiredParams {
  proposalId: string;
}
