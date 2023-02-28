import ButtonIcon from '@components/ButtonIcon';
import s from './styles.module.scss';
import React, { useState } from 'react';
import { generateBitcoinTaprootKey } from '@hooks/useBTCSignOrd/connect.methods';
import * as SDK from 'generative-sdk';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { Loading } from '@components/Loading';
import ModalExportKey, {
  IExportKeySetProps,
} from '@containers/Profile/ButtonExportKey/ModalExportKey';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';

const ButtonExportKey = () => {
  const user = useAppSelector(getUserSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState<IExportKeySetProps>({
    privateKey: '',
    address: '',
  });

  const [show, setIsShow] = useState<boolean>(false);

  const handleExport = async () => {
    try {
      if (!user || !user.walletAddress) return;
      setLoading(true);
      const { taprootChild, address } = await generateBitcoinTaprootKey(
        user.walletAddress
      );
      const privateKey = taprootChild.privateKey;
      const publicKey = taprootChild.publicKey;

      if (privateKey && address && publicKey) {
        const _privateKey = SDK.convertPrivateKey(privateKey);
        setKey({
          privateKey: _privateKey,
          address,
        });
      }
      setIsShow(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  return (
    <>
      <ButtonIcon
        type="button"
        onClick={handleExport}
        startIcon={
          <SvgInset
            className={s.iconShare}
            svgUrl={`${CDN_URL}/icons/ic-share.svg`}
          />
        }
      >
        Export private key
      </ButtonIcon>
      {show && (
        <ModalExportKey
          showModal={show}
          keySet={key}
          onClose={() => {
            setIsShow(false);
          }}
        />
      )}
      <Loading isLoaded={!loading} />
    </>
  );
};

export default ButtonExportKey;
