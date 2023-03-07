import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import ButtonIcon from '@components/ButtonIcon';
import { ROUTE_PATH } from '@constants/route-path';
import ButtonExportKey from '@containers/Profile/ButtonExportKey';
import React, { useContext } from 'react';
import { WalletContext } from '@contexts/wallet-context';
import { useRouter } from 'next/router';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { toast } from 'react-hot-toast';

const WalletTab = () => {
  const walletCtx = useContext(WalletContext);
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const handleCopy = (): void => {
    navigator.clipboard.writeText(user?.walletAddressBtcTaproot || '');
    toast.remove();
    toast.success('Copied');
  };
  return (
    <div className={s.container}>
      <p className={s.container_title}>BTC wallet address</p>
      <QRCodeGenerator
        className={s.qrCodeGenerator}
        size={160}
        value={user?.walletAddressBtcTaproot || ''}
      />
      <div className={s.row}>
        <p className={s.row_address}>{user?.walletAddressBtcTaproot}</p>
        <SvgInset
          size={18}
          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
          className={s.row_iconCopy}
          onClick={() => handleCopy()}
        />
      </div>
      <ButtonExportKey />
      <ButtonIcon
        onClick={() => {
          walletCtx.disconnect();
          router.replace(ROUTE_PATH.WALLET);
        }}
      >
        Disconnect wallet
      </ButtonIcon>
    </div>
  );
};

export default WalletTab;
