import React from 'react';
import s from './Trade.module.scss';
import { RecentWorks } from './RecentWorks';
import { Container } from 'react-bootstrap';

import { LoadingProvider } from '@contexts/loading-context';

const PageTrade = (): JSX.Element => {
  return (
    <div className={s.trade}>
      <Container>
        <RecentWorks />
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
