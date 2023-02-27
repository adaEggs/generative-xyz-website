import * as GENERATIVE_SDK from 'generative-sdk';
import { generateBitcoinTaprootKey } from '@hooks/useBTCSignOrd/connect.methods';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from '@contexts/profile-context';
import { broadcastTx, trackTx } from '@services/bitcoin';
import { ICollectedUTXOResp, TrackTxType } from '@interfaces/api/bitcoin';
import { ISendBTCProps, ISendInsProps } from '@bitcoin/types';
import { debounce } from 'lodash';
import { setPendingUTXOs } from '@containers/Profile/ButtonSendBTC/storage';

interface IProps {
  inscriptionID?: string;
}

const useBitcoin = ({ inscriptionID }: IProps = {}) => {
  const user = useSelector(getUserSelector);
  const { collectedUTXOs } = useContext(ProfileContext);
  const [satoshiAmount, setAmount] = useState(0);

  const sendInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
  }: ISendInsProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;

    if (!evmAddress || !inscriptionID || !collectedUTXOs || !taprootAddress)
      return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex, selectedUTXOs } = GENERATIVE_SDK.createTx(
      privateKey,
      collectedUTXOs.txrefs,
      collectedUTXOs.inscriptions_by_outputs,
      inscriptionID,
      receiverAddress,
      0,
      feeRate
    );
    // broadcast tx
    await broadcastTx(txHex);
    await trackTx({
      txhash: txID,
      address: taprootAddress,
      receiver: receiverAddress,
      inscription_id: inscriptionID,
      inscription_number: inscriptionNumber,
      send_amount: 0,
      type: TrackTxType.inscription,
    });
    setPendingUTXOs(selectedUTXOs);
  };

  const sendBitcoin = async ({
    receiverAddress,
    feeRate,
    amount,
  }: ISendBTCProps) => {
    const evmAddress = user?.walletAddress;
    const taprootAddress = user?.walletAddressBtcTaproot;
    if (!evmAddress || !collectedUTXOs || !taprootAddress) return;
    const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
    const privateKey = taprootChild.privateKey;
    if (!privateKey) throw 'Sign error';
    const { txID, txHex } = GENERATIVE_SDK.createTx(
      privateKey,
      collectedUTXOs.txrefs,
      collectedUTXOs.inscriptions_by_outputs,
      '',
      receiverAddress,
      amount,
      feeRate
    );
    // broadcast tx
    await broadcastTx(txHex);
    await trackTx({
      txhash: txID,
      address: taprootAddress,
      receiver: receiverAddress,
      inscription_id: '',
      inscription_number: 0,
      send_amount: 0,
      type: TrackTxType.normal,
    });
  };

  const getBalance = (_collectedUTXOs: ICollectedUTXOResp | undefined) => {
    if (!_collectedUTXOs) return setAmount(0);
    setAmount(
      GENERATIVE_SDK.getBTCBalance({
        utxos: _collectedUTXOs.txrefs,
        inscriptions: _collectedUTXOs.inscriptions_by_outputs,
      })
    );
  };

  const debounceGetBalance = debounce(getBalance, 300);

  useEffect(() => {
    debounceGetBalance(collectedUTXOs);
  }, [collectedUTXOs]);

  return {
    sendInscription,
    sendBitcoin,
    satoshiAmount,
  };
};

export default useBitcoin;
