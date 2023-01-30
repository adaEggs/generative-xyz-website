import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-eth';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractWETHAbi from '@services/contract-abis/weth.json';
import { IDepositWETHParams } from '@interfaces/contract-operations/deposit-weth';
import { ErrorMessage } from '@enums/error-message';
import { WETH_ADDRESS } from '@constants/contract-address';
import Web3 from 'web3';

class DepositWETHOperation extends ContractOperation<
  IDepositWETHParams,
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

    const data = await this.contract.methods.deposit().send({
      from: walletAddress,
      to: this.contractAddress,
      value: Web3.utils.toWei(amount),
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

export default DepositWETHOperation;
