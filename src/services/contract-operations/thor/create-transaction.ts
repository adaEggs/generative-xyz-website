import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import ContractOperation from '@services/contract-operations/contract-operation';
import ContractABI from '@services/contract-abis/thor.json';
import { ErrorMessage } from '@enums/error-message';
import { ROOT_ADDRESS, THOR_CHAIN_ADDRESS } from '@constants/contract-address';
import { TransactionReceipt } from 'web3-eth';
import { ICreateSwapParams } from '@interfaces/contract-operations/create-swap-operation';

class CreateSwapOperation extends ContractOperation<
  ICreateSwapParams,
  TransactionReceipt
> {
  contractAddress = THOR_CHAIN_ADDRESS;
  contract: Contract | null = null;

  async prepare(): Promise<void> {
    this.contract = await this.walletManager.getContract(
      this.contractAddress,
      ContractABI as Array<AbiItem>
    );
  }

  async call(): Promise<TransactionReceipt> {
    if (!this.contract) {
      throw Error('Contract not found');
    }

    const walletAddress = await this.walletManager.connectedAddress();

    const {
      inbound_address,
      expected_amount_out,
      expiry,
      memo,
      router,
      amount,
    } = this.params;

    // function depositWithExpiry(address payable vault, address asset, uint amount, string memory memo, uint expiration)
    const data = await this.contract.methods
      .depositWithExpiry(
        inbound_address,
        ROOT_ADDRESS,
        expected_amount_out,
        memo,
        expiry
      )
      .send({
        from: walletAddress,
        to: router,
        value: amount,
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

export default CreateSwapOperation;
