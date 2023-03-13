import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import s from './Detail.module.scss';

import { LoadingProvider } from '@contexts/loading-context';

const RequestDetailPage = (): JSX.Element => {
  return (
    <div className={s.detail}>
      <Container>
        <Row>
          <Col md={12}>Detail page</Col>
        </Row>
      </Container>
    </div>
  );
};

const WrapperRequest = (): JSX.Element => {
  return (
    <LoadingProvider
      simple={{
        theme: 'light',
        isCssLoading: false,
      }}
    >
      <RequestDetailPage />
    </LoadingProvider>
  );
};

export default WrapperRequest;
