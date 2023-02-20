import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { Col, Row } from 'react-bootstrap';
import s from './MetamaskXOrdinals.module.scss';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

const MetamaskXOrdinals = () => {
  const { ordAddress: _, onButtonClick } = useBTCSignOrd();
  const router = useRouter();

  const onConnect = () => {
    onButtonClick({
      cbSigned: () => {
        router.replace('/profile');
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
          <Text className={s.title}>Metamask x Ordinals</Text>
          <Text className={s.subTitle}>
            Keep your Ordinal inscriptions secure with the most trusted and
            easy-to-use crypto wallet.
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
          <div className={s.buttonContainer} onClick={onConnect}>
            <div className={s.createButton}>
              <Text className={s.createText}>CREATE YOUR VAULT</Text>
            </div>
          </div>
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
