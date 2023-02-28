import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { Col, Row } from 'react-bootstrap';
import s from './MetamaskXOrdinals.module.scss';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';

const MetamaskXOrdinals = () => {
  const { ordAddress: _, onButtonClick } = useBTCSignOrd();
  const router = useRouter();
  const { next } = router.query;

  const onConnect = () => {
    onButtonClick({
      cbSigned: () => {
        router.replace((next as string) || '/profile');
      },
    });
  };

  const renderDescItem = (child: () => React.ReactElement) => {
    return (
      <div className={s.descItem}>
        <SvgInset
          size={20}
          svgUrl={`${CDN_URL}/icons/check-circle.svg`}
          className={s.icon}
        />
        {child()}
      </div>
    );
  };

  return (
    <Container>
      <Row className={s.metamaskContainer}>
        <Col md={'12'} xl={'5'} className={s.leftContainer}>
          <p className={s.title}>Generative Wallet</p>
          <Text className={s.subTitle}>
            Built on top of Metamask, the most trusted crypto wallet, Generative
            Wallet lets you securely keep your Ordinal Inscription.
          </Text>
          {renderDescItem(() => (
            <Text className={s.text}>
              Works effortlessly with hardware wallets like{' '}
              <a
                className={s.link}
                target="_blank"
                href="https://www.ledger.com/"
                rel="noreferrer"
              >
                Ledger
              </a>{' '}
              and{' '}
              <a
                className={s.link}
                target="_blank"
                href="https://trezor.io/"
                rel="noreferrer"
              >
                Trezor
              </a>
              .
            </Text>
          ))}
          {renderDescItem(() => (
            <Text className={s.text}>
              Full feature set where you can send, receive, store and trade.
            </Text>
          ))}
          {renderDescItem(() => (
            <Text className={s.text}>
              MetaMask is trusted by over 30 million users worldwide.
            </Text>
          ))}
          <ButtonIcon variants="blue" className={s.login} onClick={onConnect}>
            <img
              src={`${CDN_URL}/icons/ic-metamask.png`}
              className={s.icMetamask}
              alt="ic-metamask"
            />
            Login via MetaMask
          </ButtonIcon>
        </Col>
        <Col
          md={'12'}
          xl={'7'}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <img
            alt="banner"
            src={`${CDN_URL}/images/metamaskordinals_banner.png`}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MetamaskXOrdinals;
