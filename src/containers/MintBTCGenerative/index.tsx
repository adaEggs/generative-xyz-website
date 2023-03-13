import ClientOnly from '@components/Utils/ClientOnly';
import RequestConnectWallet from '@containers/RequestConnectWallet';
import { MintBTCGenerativeContextProvider } from '@contexts/mint-btc-generative-context';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import { getUserSelector } from '@redux/user/selector';
import log from '@utils/logger';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import MintGenerativeController from './MintGenerativeController';

const LOG_PREFIX = 'MintBTCGenerative';

const MintBTCGenerative: React.FC = (): React.ReactElement => {
  const user = useSelector(getUserSelector);
  const walletCtx = useContext(WalletContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsProcessing(true);
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <RequestConnectWallet
        isProcessing={isProcessing}
        handleConnectWallet={handleConnectWallet}
      />
    );
  }

  return (
    <MintBTCGenerativeContextProvider>
      <ClientOnly>
        <MintGenerativeController />
      </ClientOnly>
    </MintBTCGenerativeContextProvider>
  );
};

export default MintBTCGenerative;
