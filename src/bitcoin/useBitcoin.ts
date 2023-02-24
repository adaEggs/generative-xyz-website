import * as GENERATIVE_SDK from 'generative-sdk';
import { generateBitcoinTaprootKey } from '@hooks/useBTCSignOrd/connect.methods';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { useContext } from 'react';
import { ProfileContext } from '@contexts/profile-context';
import { broadcastTx, trackTx } from '@services/bitcoin';
import { TrackTxType } from '@interfaces/api/bitcoin';

interface IProps {
  inscriptionID?: string;
}

interface IButtonProps {
  receiverAddress: string;
  feeRate: number;
  inscriptionNumber: number;
}

const useBitcoin = ({ inscriptionID }: IProps) => {
  const user = useSelector(getUserSelector);
  const { collectedUTXOs } = useContext(ProfileContext);

  const sendInscription = async ({
    receiverAddress,
    feeRate,
    inscriptionNumber,
  }: IButtonProps) => {
    if (!inscriptionID || !receiverAddress) return;
    const walletAddress = user?.walletAddress;
    const walletAddressBtcTaproot = user?.walletAddressBtcTaproot;

    if (
      !walletAddress ||
      !inscriptionID ||
      !collectedUTXOs ||
      !walletAddressBtcTaproot
    )
      return;
    const { taprootChild, address: taprootAddress } =
      await generateBitcoinTaprootKey(walletAddress);
    const privateKey = taprootChild.privateKey;
    if (!!privateKey && !!taprootAddress) {
      const { txID, txHex } = GENERATIVE_SDK.createTx(
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
        address: walletAddressBtcTaproot,
        inscription_id: inscriptionID,
        inscription_number: inscriptionNumber,
        send_amount: 0,
        type: TrackTxType.inscription,
      });
    }
  };

  return {
    sendInscription,
  };
};

export default useBitcoin;
