import React, { useContext, useState } from 'react';
import { WalletContext } from '@contexts/wallet-context';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';

interface IBTCSignOrgProps {
  processing: boolean;
  onButtonClick: ({ cbSigned }: IBtnProps) => Promise<void>;
  ordAddress: string;
}

interface IBtnProps {
  cbSigned?: () => void; // callback signed
}

const useBTCSignOrd = (): IBTCSignOrgProps => {
  const walletCtx = useContext(WalletContext);
  const user = useSelector(getUserSelector);

  const [processing, setProcessing] = useState<boolean>(false);
  const [ordAddress, setOrdAddress] = useState<string>('');

  const onButtonClick = async ({ cbSigned }: IBtnProps) => {
    if (processing) return;
    try {
      setProcessing(true);
      // check connect wallet
      if (!user || !user.walletAddressBtcTaproot) {
        if (!cbSigned) return walletCtx.connect();
        await walletCtx.connect();
      }

      if (cbSigned && typeof cbSigned === 'function') {
        cbSigned();
      }
    } catch (e) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (!user || !user.walletAddressBtcTaproot) return setOrdAddress('');
    setOrdAddress(user.walletAddressBtcTaproot);
  }, [user]);

  return {
    processing,
    onButtonClick,
    ordAddress,
  } as IBTCSignOrgProps;
};

export default useBTCSignOrd;
