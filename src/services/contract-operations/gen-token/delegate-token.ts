import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/gen-token.json';
import { ErrorMessage } from '@enums/error-message';
import { GEN_TOKEN_ADDRESS } from '@constants/contract-address';
import { IDelegateGENTokenParams } from '@interfaces/contract-operations/delegate-gen-token';
import { TransactionReceipt } from 'web3-eth';

class DelegateGENTokenOperation extends ContractOperation<
  IDelegateGENTokenParams,
  TransactionReceipt
> {
  contract: Contract | null = null;
  contractAddress = GEN_TOKEN_ADDRESS;

  async prepare(): Promise<void> {
    this.contract = await this.walletManager.getContract(
      this.contractAddress,
      ContractABI.abi as Array<AbiItem>
    );
  }

  async call(): Promise<TransactionReceipt> {
    if (!this.contract) {
      throw Error('Contract not found');
    }

    const { delegateeAddress } = this.params;

    // Delegatee address
    const walletAddress = await this.walletManager.connectedAddress();

    const data = await this.contract.methods.delegate(delegateeAddress).send({
      from: walletAddress,
      to: this.contractAddress,
      value: '0',
    });

    return data;
  }

  success(): string {
    return 'OK';
  }

  error(): string {
    return ErrorMessage.DEFAULT;
  }
}

export default DelegateGENTokenOperation;
