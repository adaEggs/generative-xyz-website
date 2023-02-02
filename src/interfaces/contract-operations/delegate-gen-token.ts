import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface IDelegateGENTokenParams
  extends ContractOperationRequiredParams {
  delegateeAddress: string;
}
