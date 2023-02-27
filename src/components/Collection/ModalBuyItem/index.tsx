import {
  default as Button,
  default as ButtonIcon,
} from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import { submitAddressBuyBTC } from '@services/marketplace-btc';
import { ellipsisCenter, formatBTCPrice, formatEthPrice } from '@utils/format';
import log from '@utils/logger';
import { formatUnixDateTime } from '@utils/time';
import { validateBTCAddressTaproot } from '@utils/validate';
import copy from 'copy-to-clipboard';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from './styles.module.scss';

interface IFormValue {
  address: string;
}

interface IProps {
  showModal: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  inscriptionID: string;
  price: number | string;
  orderID: string;
  ordAddress: string;
  payType: 'eth' | 'btc';
}

const LOG_PREFIX = 'BuyModal';

const ModalBuyItem = ({
  showModal,
  onClose,
  price,
  inscriptionID,
  orderID,
  ordAddress,
  payType = 'btc',
}: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [expireTime, setExpireTime] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const [isShowAdvance, setIsShowAdvance] = useState(false);

  const [step, setsTep] = useState<'info' | 'showAddress'>('info');

  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');
  const [addressInput, setAddressInput] = useState<string>('');

  const [ethPrice, setEthPrice] = useState(price);

  const unit = payType === 'btc' ? 'BTC' : 'ETH';
  const formatPrice =
    payType === 'btc'
      ? formatBTCPrice(price || 0, '0.0')
      : formatEthPrice(`${ethPrice || 0}`, '0.0');

  const onClickCopy = (text: string) => {
    copy(text);
    toast.remove();
    toast.success('Copied');
  };

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Address is required.';
    } else if (!validateBTCAddressTaproot(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else {
      if (step === 'showAddress' && addressInput !== values.address) {
        setAddressInput(values.address);
        onSubmitAddress(values.address);
      }
    }

    return errors;
  };

  const onClickPay = () => {
    if (useWallet === 'default') {
      onSubmitAddress(ordAddress);
    }
  };

  const onSubmitAddress = async (address: string) => {
    try {
      setIsLoading(true);
      const data = await submitAddressBuyBTC({
        walletAddress: address,
        inscriptionID,
        orderID,
        payType,
      });
      if (payType === 'eth' && data && data.price) {
        setEthPrice(data.price);
      }
      if (data?.receiveAddress) {
        setReceiveAddress(data.receiveAddress);
        setExpireTime(data.timeoutAt);
        setsTep('showAddress');
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (err && err?.message) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setErrMessage(err?.message);
      }
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
      if (step === 'showAddress' && ordAddress) {
        onSubmitAddress(ordAddress);
      }
    }
  };

  const onClickUseAnother = () => {
    if (useWallet !== 'another') {
      setUseWallet('another');
    }
  };

  const handleSubmit = async (_data: IFormValue) => {
    if (addressInput !== _data.address) {
      setAddressInput(_data.address);
      onSubmitAddress(_data.address);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    setReceiveAddress('');
    setExpireTime('');
    setErrMessage('');
    onClose();
  };

  if (!showModal) {
    return <></>;
  }

  return (
    <div className={s.mintBTCGenerativeModal}>
      <div className={s.backdrop}>
        <div
          className={`${s.modalWrapper}  ${
            step === 'info' ? s.showInfo : s.showAddress
          }`}
        >
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={handleClose}
                className={s.closeBtn}
                variants="ghost"
                type="button"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <Col className={s.modalBody}>
              <Row className={s.row}>
                <Col md={step === 'info' ? '12' : '6'}>
                  <h3 className={s.modalTitle}>Payment</h3>
                  <div className={s.payment}>
                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_title}>Item price</p>
                      <div
                        className={s.paymentPrice_copyContainer}
                        onClick={() => onClickCopy(`${formatPrice}`)}
                      >
                        <SvgInset
                          className={s.ic}
                          size={18}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                        />
                        <p className={s.text}>{`${formatPrice} ${unit}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className={s.formWrapper}>
                    <div className={s.advancedContainer}>
                      <h3 className={s.modalTitle}>Advanced</h3>
                      <SvgInset
                        className={`${s.icArrow} ${
                          isShowAdvance ? s.close : ''
                        }`}
                        size={20}
                        svgUrl={`${CDN_URL}/icons/arrow-up.svg`}
                        onClick={() => setIsShowAdvance(!isShowAdvance)}
                      />
                    </div>
                    {isShowAdvance && (
                      <>
                        <div className={s.checkboxContainer}>
                          <div className={s.checkbox}>
                            <SvgInset
                              className={s.checkbox_ic}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/${
                                useWallet === 'default'
                                  ? 'ic_checkboxed'
                                  : 'ic_checkbox'
                              }.svg`}
                              onClick={onClickUseDefault}
                            />
                            <p className={s.checkbox_text}>
                              Your Generative Wallet
                            </p>
                          </div>
                          <div
                            className={s.checkbox}
                            style={{ marginLeft: 24 }}
                          >
                            <SvgInset
                              className={s.checkbox_ic}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/${
                                useWallet === 'another'
                                  ? 'ic_checkboxed'
                                  : 'ic_checkbox'
                              }.svg`}
                              onClick={onClickUseAnother}
                            />
                            <p className={s.checkbox_text}>
                              Send to another wallet
                            </p>
                          </div>
                        </div>
                        {useWallet === 'default' && (
                          <div className={s.noteContainer}>
                            Your Ordinal inscription will be stored securely in
                            your Generative Wallet. We recommend Generative
                            Wallet for ease-of-use, security, and the best
                            experience on Generative.
                          </div>
                        )}

                        {useWallet === 'another' && (
                          <Formik
                            key="mintBTCGenerativeForm"
                            initialValues={{
                              address: '',
                            }}
                            validate={validateForm}
                            onSubmit={handleSubmit}
                          >
                            {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                            }) => (
                              <form onSubmit={handleSubmit}>
                                <div className={s.formItem}>
                                  {/* <label className={s.label} htmlFor="address">
                                    {`Enter the Ordinals-compatible BTC address to
                                receive your buying inscription`}
                                  </label> */}
                                  <div className={s.inputContainer}>
                                    <input
                                      id="address"
                                      type="text"
                                      name="address"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.address}
                                      className={s.input}
                                      placeholder={`Paste your Ordinals-compatible BTC address here`}
                                    />
                                  </div>
                                  {errors.address && touched.address && (
                                    <p className={s.inputError}>
                                      {errors.address}
                                    </p>
                                  )}
                                </div>
                                {step === 'info' && useWallet === 'another' && (
                                  <ButtonIcon
                                    type="submit"
                                    sizes="large"
                                    className={s.buyBtn}
                                    disabled={isLoading}
                                  >
                                    Pay
                                  </ButtonIcon>
                                )}
                              </form>
                            )}
                          </Formik>
                        )}
                      </>
                    )}

                    {step === 'info' && useWallet === 'default' && (
                      <ButtonIcon
                        sizes="large"
                        className={s.buyBtn}
                        disabled={isLoading}
                        onClick={onClickPay}
                      >
                        Pay
                      </ButtonIcon>
                    )}

                    {isLoading && (
                      <div className={s.loadingWrapper}>
                        <Loading isLoaded={false} />
                      </div>
                    )}

                    {!!errMessage && (
                      <div className={s.error}>{errMessage}</div>
                    )}
                  </div>
                </Col>

                {step === 'showAddress' && (
                  <Col md={'6'}>
                    <div className={s.paymentWrapper}>
                      {receiveAddress && !isLoading && (
                        <div className={s.qrCodeWrapper}>
                          <p className={s.qrTitle}>
                            Send{' '}
                            <span style={{ fontWeight: 'bold' }}>
                              {' '}
                              {formatPrice} {unit}
                            </span>{' '}
                            to this payment address
                          </p>

                          <div className={s.btcAddressContainer}>
                            <p className={s.btcAddress}>
                              {ellipsisCenter({
                                str: receiveAddress || '',
                                limit: 16,
                              })}
                            </p>
                            <SvgInset
                              className={s.icCopy}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                              onClick={() => onClickCopy(receiveAddress || '')}
                            />
                          </div>

                          <QRCodeGenerator
                            className={s.qrCodeGenerator}
                            size={128}
                            value={receiveAddress || ''}
                          />
                          {!!expireTime && (
                            <p className={s.expire}>
                              Expires at:{' '}
                              {formatUnixDateTime({
                                dateTime: Number(expireTime),
                              })}
                            </p>
                          )}
                        </div>
                      )}
                      {isLoading && (
                        <div className={s.loadingWrapper}>
                          <Loading isLoaded={false} />
                        </div>
                      )}
                    </div>

                    <div className={s.btnContainer}>
                      {/* <ButtonIcon
                        sizes="large"
                        className={s.checkBtn}
                        onClick={() => router.push(ROUTE_PATH.PROFILE)}
                        variants="outline-small"
                      >
                        <Text as="span" size="16" fontWeight="medium">
                          Check order status
                        </Text>
                      </ButtonIcon>
                      <div style={{ width: 16 }} /> */}
                      <ButtonIcon
                        sizes="large"
                        className={s.buyBtn}
                        onClick={handleClose}
                      >
                        <Text as="span" size="16" fontWeight="medium">
                          Continue collecting
                        </Text>
                      </ButtonIcon>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBuyItem;
