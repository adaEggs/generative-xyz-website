import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/gen-dao.json';
import { ErrorMessage } from '@enums/error-message';
import { GEN_DAO_ADDRESS } from '@constants/contract-address';
import { TransactionReceipt } from 'web3-eth';
import { IExecuteProposalParams } from '@interfaces/contract-operations/execute-proposal';

class ExecuteProposalOperation extends ContractOperation<
  IExecuteProposalParams,
  TransactionReceipt
> {
  contract: Contract | null = null;
  contractAddress = GEN_DAO_ADDRESS;

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

    const { proposalId } = this.params;
    const walletAddress = await this.walletManager.connectedAddress();

    const data = await this.contract.methods.execute(proposalId).send({
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

export default ExecuteProposalOperation;
