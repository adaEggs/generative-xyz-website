import Button from '@components/ButtonIcon';
import ClientOnly from '@components/Utils/ClientOnly';
import { MintBTCGenerativeContextProvider } from '@contexts/mint-btc-generative-context';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import { getUserSelector } from '@redux/user/selector';
import log from '@utils/logger';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import MintGenerativeController from './MintGenerativeController';
import s from './styles.module.scss';

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
      <div className={s.unauthorizedWrapper}>
        <div className={s.actionWrapper}>
          <Button disabled={isProcessing} onClick={handleConnectWallet}>
            {isProcessing ? 'Connecting' : 'Connect wallet'}
          </Button>
          <p className={s.text}>To continue you need to connect your wallet.</p>
        </div>
      </div>
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
