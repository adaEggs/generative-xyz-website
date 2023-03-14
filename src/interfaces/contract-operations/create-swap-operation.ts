import { ContractOperationRequiredParams } from '@interfaces/contract';
import BigNumber from 'bignumber.js';

export interface ICreateSwapParams extends ContractOperationRequiredParams {
  inbound_address: string;
  memo: string;
  expiry: number;
  router: string;
  amount: BigNumber;
}
