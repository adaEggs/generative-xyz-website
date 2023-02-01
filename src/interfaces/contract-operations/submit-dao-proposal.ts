import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface ISubmitDAOProposalParams
  extends ContractOperationRequiredParams {
  targets: Array<string>;
  values: Array<string>;
  description: string;
  calldatas: {
    funcName: string;
    args: Array<string>;
  };
}
