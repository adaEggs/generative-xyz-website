import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface ICreateSwapParams extends ContractOperationRequiredParams {
  inbound_address: string;
  expected_amount_out: number;
  memo: string;
  expiry: number;
  router: string;
  amount: number;
}
