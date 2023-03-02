import {
  default as Button,
  default as ButtonIcon,
} from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import { validateBTCAddressTaproot } from '@utils/validate';
import copy from 'copy-to-clipboard';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
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

const ModalBuyItemViaPSBT = ({
  showModal,
  onClose,
  price,
  payType = 'btc',
}: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const [isShowAdvance, setIsShowAdvance] = useState(false);

  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');

  const unit = payType === 'btc' ? 'BTC' : 'ETH';
  const formatPrice =
    payType === 'btc'
      ? formatBTCPrice(price || 0, '0.0')
      : formatEthPrice(`${price || 0}`, '0.0');

  const totalFormatPrice = formatPrice;
  const feePriceFormat = '0.0';

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
    }
    return errors;
  };

  const onClickPay = () => {
    //TODO
  };

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
    }
  };

  const onClickUseAnother = () => {
    if (useWallet !== 'another') {
      setUseWallet('another');
    }
  };

  const handleSubmit = (_data: IFormValue) => {
    //TODO
  };

  const handleClose = () => {
    setIsLoading(false);
    setErrMessage('');
    onClose();
  };

  if (!showModal) {
    return <></>;
  }

  return (
    <div className={s.mintBTCGenerativeModal}>
      <div className={s.backdrop}>
        <div className={`${s.modalWrapper} ${s.showInfo}`}>
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
                <Col md={'12'}>
                  <h3 className={s.modalTitle}>Payment</h3>
                  <div className={s.payment}>
                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_title}>Item price</p>
                      <p
                        className={s.paymentPrice_price}
                      >{`${formatPrice} ${unit}`}</p>
                    </div>
                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_title}>Inscription fee</p>
                      <p
                        className={s.paymentPrice_price}
                      >{`${feePriceFormat} ${unit}`}</p>
                    </div>
                    <div className={s.indicator} />

                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_total}>Total</p>
                      <div
                        className={s.paymentPrice_copyContainer}
                        onClick={() => onClickCopy(`${totalFormatPrice}`)}
                      >
                        <SvgInset
                          className={s.ic}
                          size={18}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                        />
                        <p
                          className={s.text}
                        >{`${totalFormatPrice} ${unit}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className={s.formWrapper}>
                    <Accordion>
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
                            <Accordion.Item
                              eventKey="0"
                              className={s.accordion_item}
                            >
                              <Accordion.Header
                                className={s.advancedContainer}
                                onClick={() => setIsShowAdvance(!isShowAdvance)}
                              >
                                <p className={s.modalTitleAdvanced}>Advanced</p>
                                <SvgInset
                                  className={`${s.icArrow} ${
                                    isShowAdvance ? s.close : ''
                                  }`}
                                  size={20}
                                  svgUrl={`${CDN_URL}/icons/arrow-up.svg`}
                                />
                              </Accordion.Header>
                              <Accordion.Body className={s.accordion_body}>
                                <div>
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
                                      Your Ordinal inscription will be stored
                                      securely in your Generative Wallet. We
                                      recommend Generative Wallet for
                                      ease-of-use, security, and the best
                                      experience on Generative.
                                    </div>
                                  )}

                                  {useWallet === 'another' && (
                                    <div className={s.formItem}>
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
                                  )}
                                </div>
                              </Accordion.Body>

                              {useWallet === 'another' && (
                                <ButtonIcon
                                  type="submit"
                                  sizes="large"
                                  className={s.buyBtn}
                                  disabled={isLoading}
                                >
                                  Pay
                                </ButtonIcon>
                              )}
                            </Accordion.Item>
                          </form>
                        )}
                      </Formik>
                    </Accordion>
                    {useWallet === 'default' && (
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
              </Row>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBuyItemViaPSBT;
