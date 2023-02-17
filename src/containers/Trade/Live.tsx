import React from 'react';
import s from './Trade.module.scss';
import { LiveWorks } from './LiveWorks';
import { Container } from 'react-bootstrap';

import { LoadingProvider } from '@contexts/loading-context';

const PageTrade = (): JSX.Element => {
  return (
    <div className={s.live}>
      <Container>
        <LiveWorks />
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
