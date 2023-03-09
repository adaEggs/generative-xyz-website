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
import throttle from 'lodash/throttle';
import bitcoinStorage from '@bitcoin/utils/storage';
import { sleep } from '@utils/sleep';
import { AssetsContext } from '@contexts/assets-context';

interface IProps {
  inscriptionID?: string;
}

const useBitcoin = ({ inscriptionID }: IProps = {}) => {
  const user = useSelector(getUserSelector);
  const { currentAssets, assets } = useContext(AssetsContext);
  const [satoshiAmount, setAmount] = useState(0);
  const sendInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
  }: ISendInsProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;

    if (!evmAddress || !inscriptionID || !currentAssets || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = GENERATIVE_SDK.createTx(
      privateKey,
      currentAssets.txrefs,
      currentAssets.inscriptions_by_outputs,
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
    if (!evmAddress || !currentAssets || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, selectedUTXOs } = GENERATIVE_SDK.createTx(
      privateKey,
      currentAssets.txrefs,
      currentAssets.inscriptions_by_outputs,
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

    // storage pending UTXOS
    bitcoinStorage.setPendingUTXOs({
      trAddress: taprootAddress,
      utxos: selectedUTXOs,
      txHash: txID,
    });
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

    if (!evmAddress || !inscriptionID || !currentAssets || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, splitTxRaw, splitUTXOs, selectedUTXOs, splitTxID } =
      await GENERATIVE_SDK.reqBuyInscription({
        buyerPrivateKey: privateKey,
        feeRatePerByte: feeRate,
        inscriptions: currentAssets.inscriptions_by_outputs,
        price: price,
        receiverInscriptionAddress: receiverInscriptionAddress,
        sellerSignedPsbtB64: sellerSignedPsbtB64,
        utxos: currentAssets.txrefs,
      });

    await Promise.all([
      await trackTx({
        txhash: txID,
        address: taprootAddress,
        receiver: receiverInscriptionAddress,
        inscription_id: inscriptionID,
        inscription_number: inscriptionNumber,
        send_amount: price,
        type: TrackTxType.buyInscription,
      }),
      await trackTx({
        txhash: splitTxID,
        address: taprootAddress,
        receiver: receiverInscriptionAddress,
        inscription_id: inscriptionID,
        inscription_number: inscriptionNumber,
        send_amount: price,
        type: TrackTxType.buySplit,
      }),
    ]);

    if (splitTxRaw) {
      await broadcastTx(splitTxRaw, true);
      await sleep(1);
    }

    // broadcast tx
    await broadcastTx(txHex);

    bitcoinStorage.setPendingUTXOs({
      trAddress: taprootAddress,
      utxos: splitUTXOs || [],
      txHash: splitTxID,
    });

    await sleep(0.5);

    bitcoinStorage.setPendingUTXOs({
      trAddress: taprootAddress,
      utxos: selectedUTXOs || [],
      txHash: txID,
    });
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

    if (!evmAddress || !inscriptionID || !currentAssets || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { splitTxID, base64Psbt, splitTxRaw, splitUTXOs } =
      await GENERATIVE_SDK.reqListForSaleInscription({
        sellerPrivateKey: privateKey,
        amountPayToSeller: amountPayToSeller,
        creatorAddress: creatorAddress,
        feePayToCreator: feePayToCreator,
        feeRatePerByte: feeRate,
        inscriptions: currentAssets.inscriptions_by_outputs,
        receiverBTCAddress: receiverBTCAddress,
        sellInscriptionID: inscriptionID,
        utxos: currentAssets.txrefs,
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

    if (splitTxID) {
      bitcoinStorage.setPendingUTXOs({
        trAddress: taprootAddress,
        utxos: splitUTXOs,
        txHash: splitTxID,
      });
    }
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

    if (!evmAddress || !inscriptionID || !currentAssets || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, selectedUTXOs } = GENERATIVE_SDK.createTx(
      privateKey,
      currentAssets.txrefs,
      currentAssets.inscriptions_by_outputs,
      inscriptionID,
      receiverAddress,
      0,
      feeRate
    );

    await Promise.all([
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
    ]);

    await sleep(1);

    // broadcast tx
    await broadcastTx(txHex);

    bitcoinStorage.setPendingUTXOs({
      trAddress: taprootAddress,
      txHash: txID,
      utxos: selectedUTXOs,
    });
  };

  // GET BALANCE
  const getBalance = (assets: ICollectedUTXOResp | undefined) => {
    if (!assets) return setAmount(0);
    setAmount(
      GENERATIVE_SDK.getBTCBalance({
        utxos: assets.txrefs,
        inscriptions: assets.inscriptions_by_outputs,
      })
    );
  };
  const debounceGetBalance = throttle(getBalance, 200);

  useEffect(() => {
    debounceGetBalance(assets);
  }, [assets]);

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
