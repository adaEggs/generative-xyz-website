import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface IDepositWETHParams extends ContractOperationRequiredParams {
  amount: string;
}
