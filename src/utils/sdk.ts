import {
  ISendInsResp,
  ISendInsReq,
  ISendBTCResp,
  ISendBTCReq,
  IBuyInsBTCResp,
  IBuyInsBTCReq,
  ISellInsResp,
  ISellInsReq,
  IAmountValidatorReq,
  IBuyMulInsBTCReq,
  IBuyMulInsBTCResp,
} from '@interfaces/sdk';
import BigNumber from 'bignumber.js';
import * as GENERATIVE_SDK from 'generative-sdk';

class GenerativeSDK {
  sendInsTransaction = async (payload: ISendInsReq): Promise<ISendInsResp> => {
    const { amount } = payload;
    const sendAmount = new BigNumber(amount || '0');
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      payload.utxos,
      payload.inscriptions,
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
    return GENERATIVE_SDK.createTx(
      payload.privateKey,
      payload.utxos,
      payload.inscriptions,
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
    return GENERATIVE_SDK.reqBuyInscription({
      buyerPrivateKey: payload.privateKey,
      feeRatePerByte: payload.feeRate,
      inscriptions: payload.inscriptions,
      receiverInscriptionAddress: payload.receiver,
      sellerSignedPsbtB64: payload.psbtB64,
      utxos: payload.utxos,
      price: itemPrice,
    });
  };
  sellInsTransaction = async (payload: ISellInsReq): Promise<ISellInsResp> => {
    const amountSeller = new BigNumber(payload.paySeller || 0);
    const amountCreator = new BigNumber(payload.payCreator || 0);
    return GENERATIVE_SDK.reqListForSaleInscription({
      sellerPrivateKey: payload.privateKey,
      amountPayToSeller: amountSeller,
      feePayToCreator: amountCreator,
      creatorAddress: payload.creatorAddress,
      feeRatePerByte: payload.feeRate,
      inscriptions: payload.inscriptions,
      receiverBTCAddress: payload.receiver,
      sellInscriptionID: payload.inscriptionID,
      utxos: payload.utxos,
    });
  };
  amountValidator = (payload: IAmountValidatorReq) => {
    const amount = new BigNumber(payload.amount).multipliedBy(1e8);
    return GENERATIVE_SDK.selectUTXOs(
      payload.assets?.txrefs || [],
      payload.assets?.inscriptions_by_outputs || {},
      payload.inscriptionID || '',
      amount,
      payload.feeRate,
      true
    );
  };
  buyMulInsBTCTransaction = async (
    payload: IBuyMulInsBTCReq
  ): Promise<IBuyMulInsBTCResp> => {
    return GENERATIVE_SDK.reqBuyMultiInscriptions({
      buyReqInfos: payload.buyInfos,
      buyerPrivateKey: payload.privateKey,
      feeRatePerByte: payload.feeRate,
      inscriptions: payload.inscriptions,
      utxos: payload.utxos,
    });
  };
}

const SDK = new GenerativeSDK();

export default SDK;
