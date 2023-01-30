import React, { useContext, useEffect } from 'react';

import s from './Display.module.scss';
import { SectionHero } from '@containers/Display/Hero';
import { Artworks } from '@containers/Display/Artworks';
import { HardWare } from './Hardware';
import { LifeStyle } from '@containers/Display/Lifestyle';
import { Prices } from '@containers/Display/Prices';
import { LoadingContext, LoadingProvider } from '@contexts/loading-context';
import CheckoutModal from '@containers/CheckoutModal';

const Display: React.FC = (): JSX.Element => {
  const { registerLoading, unRegisterLoading } = useContext(LoadingContext);
  registerLoading('Display');
  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.classList.add('is-landing');
    }

    unRegisterLoading('Display');
    return () => {
      if (html) {
        html.classList.remove('is-landing');
      }
      unRegisterLoading('Display');
    };
  }, []);

  return (
    <div className={`${s.Home} desc__body`}>
      <SectionHero />
      <Artworks />
      <HardWare />
      <LifeStyle />
      <Prices />
      <CheckoutModal />
    </div>
  );
};
const WrapDisplay = (): JSX.Element => {
  return (
    <LoadingProvider>
      <Display />
    </LoadingProvider>
  );
};

export default WrapDisplay;
