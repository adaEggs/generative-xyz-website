import React, { useContext, useState } from 'react';
import { WalletContext } from '@contexts/wallet-context';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';

interface IBTCSignOrgProps {
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
      if (!user || !user.walletAddress) {
        await walletCtx.connect();
      }

      if (cbSigned && typeof cbSigned === 'function') {
        cbSigned();
      }

      // const _address = user && user.walletAddress;
      // if (_address) {
      //   // check storage account before
      //   let ordAddress = getBTCOrdAddress(_address);
      //   // call sign method if taprootAddress empty
      //   if (!ordAddress) {
      //     const data = await handleSign(_address);
      //     if (data && data.address) {
      //       const ordAddress = data.address;
      //       setBTCOrdAddress(_address, ordAddress);
      //     }
      //   }
      //   ordAddress = getBTCOrdAddress(_address);
      //   if (!ordAddress) {
      //     return toast.error('Ordinals address is empty.');
      //   } else {
      //     setOrdAddress(ordAddress);
      //   }
      //   if (cbSigned && typeof cbSigned === 'function') {
      //     cbSigned();
      //   }
      // }
    } catch (e) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (!user || !user.walletAddressBtc) return setOrdAddress('');
    setOrdAddress(user.walletAddressBtc);
  }, [user]);

  return {
    onButtonClick,
    ordAddress,
  } as IBTCSignOrgProps;
};

export default useBTCSignOrd;
