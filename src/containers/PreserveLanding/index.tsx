import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { Col, Row } from 'react-bootstrap';
import s from './styles.module.scss';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import { ROUTE_PATH } from '@constants/route-path';
import React, { useMemo } from 'react';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import SvgInset from '@components/SvgInset';

const PreserveLanding = (): JSX.Element => {
  const { onButtonClick } = useBTCSignOrd();
  const user = useAppSelector(getUserSelector);
  const router = useRouter();

  const goToAuthentic = (): void => {
    router.push(ROUTE_PATH.AUTHENTIC);
  };

  const onConnect = () => {
    onButtonClick({ cbSigned: goToAuthentic });
  };

  const isUser = useMemo((): boolean => {
    return Boolean(user);
  }, [user]);

  return (
    <Container>
      <Row className={s.metamaskContainer}>
        <Col md={'12'} xl={'6'} className={s.leftContainer}>
          <p className={s.title}>CryptoArt & NFT Preservation</p>
          <Text className={s.subTitle}>
            Preserve your valuable Ethereum CryptoArt and NFTs on Bitcoin.
          </Text>
          <Text className={s.text}>
            When you collect an Ethereum NFT, your ownership information is
            on-chain, but the content of the NFT is not. It is often stored on
            centralized servers.
            <br />
            <br />
            The Bitcoin network is the perfect place for preserving that
            valuable content with its large on-chain storage in perpetuity.
            <br />
            <br />
            Login with MetaMask, pick an Ethereum NFT, then preserve it — it’s
            that easy.
          </Text>
          <br />
          <br />
          <br />
          {isUser ? (
            <ButtonIcon
              variants="blue-deep"
              className={s.login}
              sizes={'large'}
              onClick={goToAuthentic}
              endIcon={
                <SvgInset
                  svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                />
              }
            >
              Check your Ethereum NFTs
            </ButtonIcon>
          ) : (
            <ButtonIcon
              sizes={'large'}
              variants="blue"
              className={s.login}
              onClick={onConnect}
            >
              <img
                src={`${CDN_URL}/icons/ic-metamask.png`}
                className={s.icMetamask}
                alt="ic-metamask"
              />
              Login via MetaMask
            </ButtonIcon>
          )}
          <br />
          <br />
          <br />
          <br />
          <Text className={s.text}>
            Generative integrates with{' '}
            <a
              className={s.link}
              href="https://delegate.cash/"
              target={'_blank'}
            >
              delegate.cash
            </a>{' '}
            to prove NFT ownership.
          </Text>
        </Col>
        <Col md={'12'} xl={'6'} className={s.poster}>
          <img alt="banner" src={`${CDN_URL}/images/authentic-poster.png`} />
        </Col>
      </Row>
    </Container>
  );
};

export default PreserveLanding;
