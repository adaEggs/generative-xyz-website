import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface IWithdrawWETHParams extends ContractOperationRequiredParams {
  amount: string;
}
