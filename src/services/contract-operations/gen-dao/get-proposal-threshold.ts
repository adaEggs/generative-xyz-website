import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/gen-dao.json';
import { ErrorMessage } from '@enums/error-message';
import { GEN_DAO_ADDRESS } from '@constants/contract-address';
import { ContractOperationRequiredParams } from '@interfaces/contract';

class GetProposalThresholdOperation extends ContractOperation<
  ContractOperationRequiredParams,
  number
> {
  contract: Contract | null = null;
  contractAddress = GEN_DAO_ADDRESS;

  async prepare(): Promise<void> {
    this.contract = await this.walletManager.getContract(
      this.contractAddress,
      ContractABI.abi as Array<AbiItem>
    );
  }

  async call(): Promise<number> {
    if (!this.contract) {
      throw Error('Contract not found');
    }

    const data = await this.contract.methods.proposalThreshold().call();

    return data;
  }

  success(): string {
    return 'OK';
  }

  error(): string {
    return ErrorMessage.DEFAULT;
  }
}

export default GetProposalThresholdOperation;
