import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { Col, Row } from 'react-bootstrap';
import s from './MetamaskXOrdinals.module.scss';

const MetamaskXOrdinals = () => {
  const renderDescItem = (child: () => React.ReactElement) => {
    return (
      <div className={s.descItem}>
        <SvgInset
          size={20}
          svgUrl={`${CDN_URL}/icons/ic-badge-gold.svg`}
          className={s.icon}
        />
        {child()}
      </div>
    );
  };

  return (
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
            <span className={s.link}>Ledger</span> and{' '}
            <span className={s.link}>Trezor</span>.
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
        <div className={s.buttonContainer}>
          <div className={s.createButton}>
            <Text className={s.createText}>CREATE YOUR VAULT</Text>
          </div>
          <div className={s.learnMoreButton}>
            <Text className={s.learnMoreText}>Learn more</Text>
            <SvgInset
              size={20}
              svgUrl={`${CDN_URL}/icons/ic-badge-gold.svg`}
              className={s.learnMoreIcon}
            />
          </div>
        </div>
      </Col>
      <Col md={'12'} xl={'7'}>
        <img alt="banner" src={`${CDN_URL}/pages/home/create-poster.png`} />
      </Col>
    </Row>
  );
};

export default MetamaskXOrdinals;