import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/gen-dao.json';
import { ErrorMessage } from '@enums/error-message';
import { GEN_DAO_ADDRESS } from '@constants/contract-address';
import { ISubmitDAOProposalParams } from '@interfaces/contract-operations/submit-dao-proposal';
import { TransactionReceipt } from 'web3-eth';

class SubmitProposalOperation extends ContractOperation<
  ISubmitDAOProposalParams,
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

    const { targets, values, calldatas, description } = this.params;

    // Delegatee address
    const walletAddress = await this.walletManager.connectedAddress();

    const encodedCallDatas = this.walletManager.encodeFunctionCall(
      calldatas.funcName,
      calldatas.args
    );

    const data = await this.contract.methods
      .propose(targets, values, encodedCallDatas, description)
      .send({
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

export default SubmitProposalOperation;
