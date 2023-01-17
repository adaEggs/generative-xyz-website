import { ContractOperationRequiredParams } from '@interfaces/contract';

export interface IGetTokenBalanceParams
  extends ContractOperationRequiredParams {
  erc721TokenAddress: string;
}
