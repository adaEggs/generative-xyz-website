import ClientOnly from '@components/Utils/ClientOnly';
import { MintBTCGenerativeContextProvider } from '@contexts/mint-btc-generative-context';
import React from 'react';
import MintGenerativeController from './MintGenerativeController';

const MintGenerative: React.FC = (): React.ReactElement => {
  return (
    <MintBTCGenerativeContextProvider>
      <ClientOnly>
        <MintGenerativeController />
      </ClientOnly>
    </MintBTCGenerativeContextProvider>
  );
};

export default MintGenerative;
