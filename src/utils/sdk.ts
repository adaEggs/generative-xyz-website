import {
  IAmountValidatorReq,
  IBuyInsBTCReq,
  IBuyInsBTCResp,
  IBuyMulInsBTCReq,
  IBuyMulInsBTCResp,
  IEstimateTxFeeReq,
  ISellInsReq,
  ISellInsResp,
  ISendBTCReq,
  ISendBTCResp,
  ISendInsReq,
  ISendInsResp,
} from '@interfaces/sdk';
import BigNumber from 'bignumber.js';
import * as GENERATIVE_SDK from 'generative-sdk';
import { getCollectedUTXO, getPendingUTXOs } from '@services/bitcoin';
import { currentAssetsBuilder } from '@utils/utxo';
import { IInscriptionByOutput } from '@interfaces/api/bitcoin';

class GenerativeSDK {
  sendInsTransaction = async (payload: ISendInsReq): Promise<ISendInsResp> => {
    const { amount } = payload;
    const sendAmount = new BigNumber(amount || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      utxos,
      inscriptions,
      payload.inscriptionID,
      payload.receiver,
      sendAmount,
      payload.feeRate,
      true
    );
  };
  sendBTCTransaction = async (payload: ISendBTCReq): Promise<ISendBTCResp> => {
    const { amount } = payload;
    const sendAmount = new BigNumber(amount || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      utxos,
      inscriptions,
      '',
      payload.receiver,
      sendAmount,
      payload.feeRate,
      true
    );
  };
  buyInsBTCTransaction = async (
    payload: IBuyInsBTCReq
  ): Promise<IBuyInsBTCResp> => {
    const itemPrice = new BigNumber(payload.price || '0');
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.reqBuyInscription({
      buyerPrivateKey: payload.privateKey,
      feeRatePerByte: payload.feeRate,
      inscriptions: inscriptions,
      receiverInscriptionAddress: payload.receiver,
      sellerSignedPsbtB64: payload.psbtB64,
      utxos: utxos,
      price: itemPrice,
    });
  };
  sellInsTransaction = async (payload: ISellInsReq): Promise<ISellInsResp> => {
    const amountSeller = new BigNumber(payload.paySeller || 0);
    const amountCreator = new BigNumber(payload.payCreator || 0);
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.reqListForSaleInscription({
      sellerPrivateKey: payload.privateKey,
      amountPayToSeller: amountSeller,
      feePayToCreator: amountCreator,
      creatorAddress: payload.creatorAddress,
      feeRatePerByte: payload.feeRate,
      inscriptions: inscriptions,
      receiverBTCAddress: payload.receiver,
      sellInscriptionID: payload.inscriptionID,
      utxos: utxos,
    });
  };
  amountValidator = (payload: IAmountValidatorReq) => {
    const amount = new BigNumber(payload.amount).multipliedBy(1e8);
    const utxos = this.formatUTXOs(payload.assets?.txrefs || []);
    const inscriptions = this.formatInscriptions(
      payload.assets?.inscriptions_by_outputs || {}
    );
    return GENERATIVE_SDK.selectUTXOs(
      utxos,
      inscriptions,
      payload.inscriptionID || '',
      amount,
      payload.feeRate,
      true
    );
  };
  buyMulInsBTCTransaction = (payload: IBuyMulInsBTCReq): IBuyMulInsBTCResp => {
    const utxos = this.formatUTXOs(payload.utxos);
    const inscriptions = this.formatInscriptions(payload.inscriptions);
    return GENERATIVE_SDK.reqBuyMultiInscriptions({
      buyReqInfos: payload.buyInfos,
      buyerPrivateKey: payload.privateKey,
      feeRatePerByte: payload.feeRate,
      inscriptions: inscriptions,
      utxos: utxos,
    });
  };
  formatUTXOs = (txrefs: GENERATIVE_SDK.UTXO[]) => {
    const utxos: GENERATIVE_SDK.UTXO[] = (txrefs || []).map(utxo => ({
      tx_hash: utxo.tx_hash,
      tx_output_n: new BigNumber(utxo.tx_output_n).toNumber(),
      value: new BigNumber(utxo.value),
    }));
    return utxos;
  };
  formatInscriptions = (inscriptions: IInscriptionByOutput) => {
    const _inscriptions: IInscriptionByOutput = {};
    Object.keys(inscriptions).forEach(key => {
      const utxos = inscriptions[key];
      if (!!utxos && !!utxos.length) {
        _inscriptions[key] = utxos?.map(utxo => ({
          ...utxo,
          offset: new BigNumber(utxo.offset),
        }));
      }
    });
    return _inscriptions;
  };
  getCurrentAssetsForCreateTx = async (address: string) => {
    const [assets, pendingUTXOs] = await Promise.all([
      await getCollectedUTXO(address),
      await getPendingUTXOs(address),
    ]);

    if (!assets) {
      throw new Error(
        GENERATIVE_SDK.ERROR_MESSAGE[
          GENERATIVE_SDK.ERROR_CODE.NOT_ENOUGH_BTC_TO_SEND
        ].message
      );
    }
    const currenAssets = currentAssetsBuilder({
      current: assets,
      pending: pendingUTXOs,
    });
    // Current assets
    if (!currenAssets) {
      throw new Error(
        GENERATIVE_SDK.ERROR_MESSAGE[
          GENERATIVE_SDK.ERROR_CODE.NOT_ENOUGH_BTC_TO_SEND
        ].message
      );
    }
    return currenAssets;
  };

  estimateTxFee = (payload: IEstimateTxFeeReq) => {
    return GENERATIVE_SDK.estimateTxFee(
      payload.numIn,
      payload.numOut,
      new BigNumber(payload.feeRate).toNumber()
    );
  };
}

const SDK = new GenerativeSDK();

export default SDK;
