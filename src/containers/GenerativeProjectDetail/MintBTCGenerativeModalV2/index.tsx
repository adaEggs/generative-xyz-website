import {
  default as Button,
  default as ButtonIcon,
} from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { sendAAEvent } from '@services/aa-tracking';
import { generateMintReceiverAddress } from '@services/mint';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import { validateBTCAddressTaproot } from '@utils/validate';
import copy from 'copy-to-clipboard';
import { Formik } from 'formik';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from './styles.module.scss';

interface IFormValue {
  address: string;
}

const MintBTCGenerativeModal: React.FC = () => {
  const router = useRouter();
  const { projectData } = useContext(GenerativeProjectDetailContext);
  const user = useAppSelector(getUserSelector);

  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');
  const [isShowAdvance, setIsShowAdvance] = useState(false);
  const [totalPrice, setTotalPrice] = React.useState('');

  const [step, setsTep] = useState<'info' | 'showAddress'>('info');

  const onClickCopy = (text: string) => {
    copy(text);
    toast.remove();
    toast.success('Copied');
  };

  const { setIsPopupPayment, paymentMethod } = useContext(
    BitcoinProjectContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState<string | null>(null);

  const [addressInput, setAddressInput] = useState<string>('');

  // const priceFormat = formatBTCPrice(Number(projectData?.mintPrice), '0.0');
  const feePriceFormat = formatBTCPrice(
    totalPrice
      ? Number(totalPrice) - Number(projectData?.mintPrice)
      : Number(projectData?.networkFee),
    '0.0'
  );
  const totalPriceFormat = formatBTCPrice(
    totalPrice ||
      `${Number(projectData?.networkFee) + Number(projectData?.mintPrice)}` ||
      ''
  );

  const userBtcAddress = useMemo(
    () => user?.walletAddressBtcTaproot || '',
    [user]
  );

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
      if (step === 'showAddress' && userBtcAddress) {
        debounceGetBTCAddress(userBtcAddress, userBtcAddress);
      }
    }
  };

  const onClickUseAnother = () => {
    if (useWallet !== 'another') {
      setUseWallet('another');
      if (step === 'showAddress' && addressInput) {
        debounceGetBTCAddress(addressInput, userBtcAddress);
      }
    }
  };

  const onClickPay = () => {
    if (useWallet === 'default') {
      if (userBtcAddress) {
        debounceGetBTCAddress(userBtcAddress, userBtcAddress);
      }
    }
  };

  const getBTCAddress = async (
    walletAddress: string,
    refundAddress: string
  ): Promise<void> => {
    if (!projectData) return;

    try {
      setIsLoading(true);
      setReceiverAddress(null);
      const { address, price } = await generateMintReceiverAddress({
        walletAddress,
        projectID: projectData.tokenID,
        payType: 'btc',
        refundUserAddress: refundAddress,
        quantity: 1,
      });
      // const { address, Price: price } = await generateBTCReceiverAddress({
      //   walletAddress,
      //   projectID: projectData.tokenID,
      // });
      setTotalPrice(price);
      sendAAEvent({
        eventName: BTC_PROJECT.MINT_NFT,
        data: {
          projectId: projectData.id,
          projectName: projectData.name,
          projectThumbnail: projectData.image,
          mintPrice: formatBTCPrice(Number(projectData?.mintPrice)),
          mintType: paymentMethod,
          networkFee: formatBTCPrice(Number(projectData?.networkFee)),
          masterAddress: address,
          totalPrice: formatBTCPrice(Number(price)),
        },
      });
      setReceiverAddress(address);
      setsTep('showAddress');
    } catch (err: unknown) {
      setReceiverAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetBTCAddress = useCallback(
    _debounce(
      (address, refundAddress) => getBTCAddress(address, refundAddress),
      500
    ),
    [projectData]
  );

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCAddressTaproot(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else {
      if (step === 'showAddress' && addressInput !== values.address) {
        setAddressInput(values.address);
        debounceGetBTCAddress(values.address, userBtcAddress);
      }
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (addressInput !== values.address) {
      debounceGetBTCAddress(values.address, userBtcAddress);
      setAddressInput(values.address);
    }
  };

  const _onClose = () => {
    setIsPopupPayment(false);
  };

  if (!projectData) {
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
                onClick={_onClose}
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
                      <p className={s.paymentPrice_price}>{`${formatBTCPrice(
                        projectData?.mintPrice || '',
                        '0.0'
                      )} BTC`}</p>
                    </div>
                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_title}>Inscription fee</p>
                      <p
                        className={s.paymentPrice_price}
                      >{`${feePriceFormat} BTC`}</p>
                    </div>
                    <div className={s.indicator} />

                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_total}>Total</p>
                      <div className={s.paymentPrice_copyContainer}>
                        <SvgInset
                          className={s.ic}
                          size={18}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                          onClick={() => onClickCopy(`${totalPriceFormat}`)}
                        />
                        <p className={s.text}>{`${totalPriceFormat} BTC`}</p>
                      </div>
                    </div>
                  </div>
                  <div className={s.formWrapper}>
                    <div className={s.advancedContainer}>
                      <h3 className={s.modalTitleAdvance}>Advanced</h3>
                      <SvgInset
                        className={`${s.icArrow} ${
                          isShowAdvance ? s.close : ''
                        }`}
                        size={20}
                        svgUrl={`${CDN_URL}/icons/arrow-up.svg`}
                        onClick={() => setIsShowAdvance(!isShowAdvance)}
                      />
                    </div>

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
                                  Your Ordinal inscription will be stored
                                  securely in your Generative Wallet. We
                                  recommend Generative Wallet for ease-of-use,
                                  security, and the best experience on
                                  Generative.
                                </div>
                              )}

                              {useWallet === 'another' && (
                                <div className={s.formItem}>
                                  {/* <label className={s.label} htmlFor="address">
                                    {`Enter the Ordinals-compatible BTC address to
                                receive your minting inscription`}
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
                                      placeholder={`Paste your BTC Ordinal wallet address here`}
                                    />
                                  </div>
                                  {errors.address && touched.address && (
                                    <p className={s.inputError}>
                                      {errors.address}
                                    </p>
                                  )}
                                </div>
                              )}
                            </>
                          )}

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

                    {step === 'info' && isLoading && (
                      <div className={s.loadingWrapper}>
                        <Loading isLoaded={false} />
                      </div>
                    )}

                    {/* {!!errMessage && (
                      <div className={s.error}>{errMessage}</div>
                    )} */}
                  </div>
                </Col>

                {step === 'showAddress' && (
                  <Col md={'6'}>
                    <div className={s.paymentWrapper}>
                      {receiverAddress && !isLoading && (
                        <div className={s.qrCodeWrapper}>
                          <p className={s.qrTitle}>
                            Send{' '}
                            <span style={{ fontWeight: 'bold' }}>
                              {totalPriceFormat} BTC
                            </span>{' '}
                            to this address
                          </p>

                          <div className={s.btcAddressContainer}>
                            <p className={s.btcAddress}>
                              {ellipsisCenter({
                                str: receiverAddress || '',
                                limit: 16,
                              })}
                            </p>
                            <SvgInset
                              className={s.icCopy}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                              onClick={() => onClickCopy(receiverAddress || '')}
                            />
                          </div>

                          <QRCodeGenerator
                            className={s.qrCodeGenerator}
                            size={128}
                            value={receiverAddress || ''}
                          />
                        </div>
                      )}
                      {isLoading && (
                        <div className={s.loadingWrapper}>
                          <Loading isLoaded={false} />
                        </div>
                      )}
                    </div>

                    <div className={s.btnContainer}>
                      <ButtonIcon
                        sizes="large"
                        className={s.buyBtn}
                        onClick={() => router.push(ROUTE_PATH.PROFILE)}
                        variants="outline"
                      >
                        <Text as="span" size="16" fontWeight="medium">
                          Check order status
                        </Text>
                      </ButtonIcon>
                      <div style={{ width: 16 }} />
                      <ButtonIcon
                        sizes="large"
                        className={s.buyBtn}
                        onClick={_onClose}
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

export default MintBTCGenerativeModal;
