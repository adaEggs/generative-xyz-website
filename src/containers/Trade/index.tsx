import React from 'react';
import s from './Trade.module.scss';
import { Container } from 'react-bootstrap';

import { LoadingProvider } from '@contexts/loading-context';
import MainScreen from '@containers/Trade/Main';

const PageTrade = (): JSX.Element => {
  return (
    <div className={s.trade}>
      <Container>
        <MainScreen />
      </Container>
    </div>
  );
};

const WrapperTrade = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <PageTrade />
    </LoadingProvider>
  );
};

export default WrapperTrade;
