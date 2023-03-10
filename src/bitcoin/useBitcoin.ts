import * as GENERATIVE_SDK from 'generative-sdk';
import { generateBitcoinTaprootKey } from '@hooks/useBTCSignOrd/connect.methods';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { useContext, useState, useEffect } from 'react';
import {
  broadcastTx,
  submitCancel,
  submitListForSale,
  trackTx,
} from '@services/bitcoin';
import { ICollectedUTXOResp, TrackTxType } from '@interfaces/api/bitcoin';
import {
  IBuyInsProps,
  ICancelInsProps,
  IListInsProps,
  ISendBTCProps,
  ISendInsProps,
} from '@bitcoin/types';
import { debounce } from 'lodash';
import { sleep } from '@utils/sleep';
import { AssetsContext } from '@contexts/assets-context';

interface IProps {
  inscriptionID?: string;
}

const useBitcoin = ({ inscriptionID }: IProps = {}) => {
  const user = useSelector(getUserSelector);
  const { currentAssets, getAvailableAssetsCreateTx } =
    useContext(AssetsContext);
  const [satoshiAmount, setAmount] = useState(0);

  const sendInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
  }: ISendInsProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;

    const _collectedUTXOs = await getAvailableAssetsCreateTx();
    if (!evmAddress || !inscriptionID || !_collectedUTXOs || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = GENERATIVE_SDK.createTx(
      privateKey,
      _collectedUTXOs.txrefs,
      _collectedUTXOs.inscriptions_by_outputs,
      inscriptionID,
      receiverAddress,
      0,
      feeRate
    );
    await trackTx({
      txhash: txID,
      address: taprootAddress,
      receiver: receiverAddress,
      inscription_id: inscriptionID,
      inscription_number: inscriptionNumber,
      send_amount: 0,
      type: TrackTxType.inscription,
    });
    // broadcast tx
    await broadcastTx(txHex);
  };

  const sendBitcoin = async ({
    receiverAddress,
    feeRate,
    amount,
  }: ISendBTCProps) => {
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    const _collectedUTXOs = await getAvailableAssetsCreateTx();
    if (!evmAddress || !_collectedUTXOs || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = GENERATIVE_SDK.createTx(
      privateKey,
      _collectedUTXOs.txrefs,
      _collectedUTXOs.inscriptions_by_outputs,
      '',
      receiverAddress,
      amount,
      feeRate
    );
    await trackTx({
      txhash: txID,
      address: taprootAddress,
      receiver: receiverAddress,
      inscription_id: '',
      inscription_number: 0,
      send_amount: amount,
      type: TrackTxType.normal,
    });
    // broadcast tx
    await broadcastTx(txHex);
    // setPendingUTXOs(selectedUTXOs);
  };

  const buyInscription = async ({
    feeRate,
    price,
    sellerSignedPsbtB64,
    receiverInscriptionAddress,
    inscriptionNumber,
  }: IBuyInsProps) => {
    if (!inscriptionID) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    const _collectedUTXOs = await getAvailableAssetsCreateTx();

    if (!evmAddress || !inscriptionID || !_collectedUTXOs || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, splitTxRaw } = await GENERATIVE_SDK.reqBuyInscription({
      buyerPrivateKey: privateKey,
      feeRatePerByte: feeRate,
      inscriptions: _collectedUTXOs.inscriptions_by_outputs,
      price: price,
      receiverInscriptionAddress: receiverInscriptionAddress,
      sellerSignedPsbtB64: sellerSignedPsbtB64,
      utxos: _collectedUTXOs.txrefs,
    });
    await trackTx({
      txhash: txID,
      address: taprootAddress,
      receiver: receiverInscriptionAddress,
      inscription_id: inscriptionID,
      inscription_number: inscriptionNumber,
      send_amount: price,
      type: TrackTxType.buyInscription,
    });

    if (splitTxRaw) {
      await broadcastTx(splitTxRaw);
      await sleep(1);
    }

    // broadcast tx
    await broadcastTx(txHex);
  };

  const listInscription = async ({
    receiverBTCAddress,
    amountPayToSeller,
    feePayToCreator,
    creatorAddress,
    feeRate,
    inscriptionNumber,
  }: IListInsProps) => {
    if (!inscriptionID) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    const _collectedUTXOs = await getAvailableAssetsCreateTx();

    if (!evmAddress || !inscriptionID || !_collectedUTXOs || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { splitTxID, base64Psbt, splitTxRaw } =
      await GENERATIVE_SDK.reqListForSaleInscription({
        sellerPrivateKey: privateKey,
        amountPayToSeller: amountPayToSeller,
        creatorAddress: creatorAddress,
        feePayToCreator: feePayToCreator,
        feeRatePerByte: feeRate,
        inscriptions: _collectedUTXOs.inscriptions_by_outputs,
        receiverBTCAddress: receiverBTCAddress,
        sellInscriptionID: inscriptionID,
        utxos: _collectedUTXOs.txrefs,
      });
    const tasks = [
      await submitListForSale({
        raw_psbt: base64Psbt,
        inscription_id: inscriptionID,
        split_tx: splitTxRaw || '',
      }),
    ];

    if (splitTxID) {
      tasks.push(
        await trackTx({
          txhash: splitTxID,
          address: taprootAddress,
          receiver: receiverBTCAddress,
          inscription_id: inscriptionID,
          inscription_number: inscriptionNumber,
          send_amount: 0,
          type: TrackTxType.listSplit,
        })
      );
    }
    await Promise.all(tasks);
  };

  const cancelInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
    orderID,
  }: ICancelInsProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    const _collectedUTXOs = await getAvailableAssetsCreateTx();

    if (!evmAddress || !inscriptionID || !_collectedUTXOs || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = GENERATIVE_SDK.createTx(
      privateKey,
      _collectedUTXOs.txrefs,
      _collectedUTXOs.inscriptions_by_outputs,
      inscriptionID,
      receiverAddress,
      0,
      feeRate
    );
    // broadcast tx
    await broadcastTx(txHex);
    await sleep(1);
    const tasks = [
      await trackTx({
        txhash: txID,
        address: taprootAddress,
        receiver: receiverAddress,
        inscription_id: inscriptionID,
        inscription_number: inscriptionNumber,
        send_amount: 0,
        type: TrackTxType.cancel,
      }),
      await submitCancel({
        inscription_id: inscriptionID,
        order_id: orderID,
        txhash: txID,
      }),
    ];
    await Promise.all(tasks);
  };

  // GET BALANCE
  const getBalance = (_collectedUTXOs: ICollectedUTXOResp | undefined) => {
    if (!_collectedUTXOs) return setAmount(0);
    setAmount(
      GENERATIVE_SDK.getBTCBalance({
        utxos: _collectedUTXOs.txrefs,
        inscriptions: _collectedUTXOs.inscriptions_by_outputs,
      })
    );
  };
  const debounceGetBalance = debounce(getBalance, 200);

  useEffect(() => {
    debounceGetBalance(currentAssets);
  }, [currentAssets]);

  return {
    sendInscription,
    sendBitcoin,
    buyInscription,
    listInscription,
    cancelInscription,

    satoshiAmount,
  };
};

export default useBitcoin;
