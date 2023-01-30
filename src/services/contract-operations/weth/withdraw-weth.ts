import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-eth';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractWETHAbi from '@services/contract-abis/weth.json';
import { IWithdrawWETHParams } from '@interfaces/contract-operations/withdraw-weth';
import { ErrorMessage } from '@enums/error-message';
import { WETH_ADDRESS } from '@constants/contract-address';
import Web3 from 'web3';

class WithdrawWETHOperation extends ContractOperation<
  IWithdrawWETHParams,
  TransactionReceipt
> {
  contract: Contract | null = null;
  contractAddress = WETH_ADDRESS;

  async prepare(): Promise<void> {
    this.contract = await this.walletManager.getContract(
      this.contractAddress,
      ContractWETHAbi.abi as Array<AbiItem>,
      false
    );
  }

  async call(): Promise<TransactionReceipt> {
    if (!this.contract) {
      throw Error('Contract not found');
    }

    const { amount } = this.params;

    const walletAddress = await this.walletManager.connectedAddress();

    const data = await this.contract.methods
      .withdraw(Web3.utils.toWei(amount))
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

export default WithdrawWETHOperation;
