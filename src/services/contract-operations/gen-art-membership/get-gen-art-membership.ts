import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/gen-art-membership.json';
import { ErrorMessage } from '@enums/error-message';
import { GENART_MEMBERSHIP_ADDRESS } from '@constants/contract-address';
import { ContractOperationRequiredParams } from '@interfaces/contract';

class GetGenArtMembershipOperation extends ContractOperation<
  ContractOperationRequiredParams,
  Array<unknown>
> {
  contract: Contract | null = null;
  contractAddress = GENART_MEMBERSHIP_ADDRESS;

  async prepare(): Promise<void> {
    this.contract = await this.walletManager.getContract(
      this.contractAddress,
      ContractABI.abi as Array<AbiItem>
    );
  }

  async call(): Promise<Array<unknown>> {
    if (!this.contract) {
      throw Error('Contract not found');
    }

    const walletAddress = await this.walletManager.connectedAddress();

    const data = await this.contract.methods
      .getMembershipsOf(walletAddress)
      .call();

    return data;
  }

  success(): string {
    return 'OK';
  }

  error(): string {
    return ErrorMessage.DEFAULT;
  }
}

export default GetGenArtMembershipOperation;
