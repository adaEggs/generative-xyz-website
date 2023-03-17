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
  IBuyMulInsProps,
  ICancelInsProps,
  IListInsProps,
  ISendBTCProps,
  ISendInsProps,
  ISignKeyResp,
} from '@bitcoin/types';
import debounce from 'lodash/debounce';
import { sleep } from '@utils/sleep';
import { AssetsContext } from '@contexts/assets-context';
import SDK from '@utils/sdk';

interface IProps {
  inscriptionID?: string;
}

const useBitcoin = ({ inscriptionID }: IProps = {}) => {
  const user = useSelector(getUserSelector);
  const { currentAssets, getAvailableAssetsCreateTx } =
    useContext(AssetsContext);
  const [satoshiAmount, setAmount] = useState(0);

  const signKey = async (): Promise<ISignKeyResp> => {
    const error = 'Can not sign with metamask';
    const evmAddress = user?.walletAddress;
    const tpAddress = user?.walletAddressBtcTaproot;
    if (!evmAddress || !tpAddress) throw new Error(error);
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw new Error(error);
    return {
      privateKey,
      tpAddress,
      evmAddress,
    };
  };

  const sendInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
  }: ISendInsProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const assets = await getAvailableAssetsCreateTx();
    const { privateKey, tpAddress } = await signKey();
    if (!assets) throw new Error('Can not load assets');
    const { txID, txHex } = await SDK.sendInsTransaction({
      privateKey,
      utxos: assets.txrefs,
      inscriptions: assets.inscriptions_by_outputs,
      inscriptionID,
      receiver: receiverAddress,
      feeRate,
    });
    await trackTx({
      txhash: txID,
      address: tpAddress,
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
    const assets = currentAssets;
    if (!assets) throw new Error('Can not load assets');
    const { privateKey, tpAddress } = await signKey();
    const { txID, txHex } = await SDK.sendBTCTransaction({
      privateKey,
      utxos: assets.txrefs,
      inscriptions: assets.inscriptions_by_outputs,
      receiver: receiverAddress,
      feeRate,
      amount,
    });
    // broadcast tx
    await broadcastTx(txHex);
    await sleep(1);
    await trackTx({
      txhash: txID,
      address: tpAddress,
      receiver: receiverAddress,
      inscription_id: '',
      inscription_number: 0,
      send_amount: amount,
      type: TrackTxType.normal,
    });
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
    const assets = await getAvailableAssetsCreateTx();
    if (!evmAddress || !inscriptionID || !assets || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, splitTxRaw } = await SDK.buyInsBTCTransaction({
      privateKey,
      feeRate,
      inscriptions: assets.inscriptions_by_outputs,
      price,
      psbtB64: sellerSignedPsbtB64,
      receiver: receiverInscriptionAddress,
      utxos: assets.txrefs,
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
    await sleep(1);
    if (splitTxRaw) {
      await broadcastTx(splitTxRaw);
      await sleep(5);
    }

    // broadcast tx
    await broadcastTx(txHex);
  };

  const listInscription = async (payload: IListInsProps) => {
    if (!inscriptionID) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    const assets = await getAvailableAssetsCreateTx();

    if (!evmAddress || !inscriptionID || !assets || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { splitTxID, base64Psbt, splitTxRaw } = await SDK.sellInsTransaction({
      privateKey,
      creatorAddress: payload.creatorAddress,
      feeRate: payload.feeRate,
      inscriptionID,
      inscriptions: assets.inscriptions_by_outputs,
      payCreator: payload.payCreator,
      paySeller: payload.paySeller,
      receiver: payload.receiver,
      utxos: assets.txrefs,
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
          receiver: payload.receiver,
          inscription_id: inscriptionID,
          inscription_number: payload.inscriptionNumber,
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
    const assets = await getAvailableAssetsCreateTx();

    if (!evmAddress || !inscriptionID || !assets || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = await SDK.sendInsTransaction({
      privateKey,
      utxos: assets.txrefs,
      inscriptions: assets.inscriptions_by_outputs,
      inscriptionID,
      receiver: receiverAddress,
      feeRate,
    });
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
        utxos: SDK.formatUTXOs(_collectedUTXOs.txrefs),
        inscriptions: SDK.formatInscriptions(
          _collectedUTXOs.inscriptions_by_outputs
        ),
      }).toNumber()
    );
  };
  const debounceGetBalance = debounce(getBalance, 200);

  useEffect(() => {
    debounceGetBalance(currentAssets);
  }, [currentAssets]);

  const buyMulInscription = async (payload: IBuyMulInsProps) => {
    const { privateKey, tpAddress } = await signKey();
    const assets = await SDK.getCurrentAssetsForCreateTx(tpAddress);
    const { txID, txHex, splitTxRaw } = SDK.buyMulInsBTCTransaction({
      privateKey,
      buyInfos: payload.buyInfos,
      feeRate: payload.feeRate,
      inscriptions: assets.inscriptions_by_outputs,
      utxos: assets.txrefs,
    });
    await trackTx({
      txhash: txID,
      address: tpAddress,
      receiver: payload.receiver,
      inscription_id: '',
      inscription_number: 0,
      send_amount: payload.price,
      type: TrackTxType.buyInscription,
    });
    await sleep(1);
    if (splitTxRaw) {
      await broadcastTx(splitTxRaw);
      await sleep(5);
    }
    // broadcast tx
    await broadcastTx(txHex);
  };

  return {
    sendInscription,
    sendBitcoin,
    buyInscription,
    listInscription,
    cancelInscription,
    buyMulInscription,

    satoshiAmount,
  };
};

export default useBitcoin;
