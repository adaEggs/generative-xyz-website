import React from 'react';
import s from './Bazaar.module.scss';
import { RecentWorks } from './RecentWorks';
import { Container } from 'react-bootstrap';

import { LoadingProvider } from '@contexts/loading-context';

const PageBazaar = (): JSX.Element => {
  return (
    <div className={s.bazaar}>
      <Container>
        <RecentWorks />
      </Container>
    </div>
  );
};

const WrapperBazaar = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <PageBazaar />
    </LoadingProvider>
  );
};

export default WrapperBazaar;
