import React from 'react';
import Container from 'react-bootstrap/Container';

import Items from './Items';
import Filter from './Filter';
import Collection from './Collection';
import s from './Search.module.scss';

import { LoadingProvider } from '@contexts/loading-context';

const SearchPage = (): JSX.Element => {
  return (
    <div className={s.search}>
      <Container>
        <Collection />
        <Filter />
        <Items />
      </Container>
    </div>
  );
};

const WrapperTrade = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <SearchPage />
    </LoadingProvider>
  );
};

export default WrapperTrade;
