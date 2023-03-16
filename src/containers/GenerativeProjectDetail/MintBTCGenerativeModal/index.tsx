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
import { capitalizeFirstLetter, isNumeric } from '@utils/string';
import { validateBTCAddressTaproot } from '@utils/validate';
import copy from 'copy-to-clipboard';
import { Formik } from 'formik';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import FeeRate from '../MintFeeRate';
import useMintFeeRate from '../MintFeeRate/useMintFeeRate';
import s from './styles.module.scss';

interface IFormValue {
  address: string;
}

const MintBTCGenerativeModal: React.FC = () => {
  const router = useRouter();
  const { projectData } = useContext(GenerativeProjectDetailContext);
  const user = useAppSelector(getUserSelector);

  const {
    projectFeeRate,
    currentFee,
    rateType,
    handleChangeRateType,
    customRate,
    handleChangeCustomRate,
  } = useMintFeeRate();

  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');
  const [isShowAdvance, setIsShowAdvance] = useState(false);
  const [totalPrice, setTotalPrice] = React.useState('');
  const [feePrice, setFeePrice] = React.useState('');
  const [mintPrice, setMintPrice] = React.useState('');

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
  const [errMessage, setErrMessage] = useState('');

  const [quantity, setQuantity] = useState(1);

  const isReserveUser =
    projectData?.reservers &&
    projectData?.reservers.length > 0 &&
    user &&
    user.walletAddressBtcTaproot &&
    projectData?.reservers.includes(user.walletAddressBtcTaproot);

  const limitMint =
    isReserveUser && projectData?.reserveMintLimit
      ? projectData?.reserveMintLimit
      : projectData?.limitMintPerProcess;

  const priceFormat = formatBTCPrice(
    mintPrice
      ? mintPrice
      : currentFee?.mintFees.btc.mintPrice ||
          projectFeeRate?.fastest.mintFees.btc.mintPrice ||
          '',

    '0.0'
  );
  const feePriceFormat = formatBTCPrice(
    feePrice
      ? Number(feePrice)
      : Number(currentFee ? currentFee.mintFees.btc.networkFee : 0),
    '0.0'
  );
  const totalPriceFormat = formatBTCPrice(
    totalPrice
      ? totalPrice
      : `${
          (Number(
            currentFee
              ? rateType === 'customRate' && !isNumeric(customRate)
                ? 0
                : currentFee.mintFees.btc.networkFee
              : 0
          ) +
            Number(
              currentFee?.mintFees.btc.mintPrice ||
                projectFeeRate?.fastest.mintFees.btc.mintPrice ||
                0
            )) *
          quantity
        }` || ''
  );

  const userBtcAddress = useMemo(
    () => user?.walletAddressBtcTaproot || '',
    [user]
  );

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
      if (step === 'showAddress' && userBtcAddress) {
        debounceGetBTCAddress(
          userBtcAddress,
          userBtcAddress,
          quantity,
          currentFee?.rate
        );
      }
    }
  };

  const onClickUseAnother = () => {
    if (useWallet !== 'another') {
      setUseWallet('another');
      if (step === 'showAddress' && addressInput) {
        debounceGetBTCAddress(
          addressInput,
          userBtcAddress,
          quantity,
          currentFee?.rate
        );
      }
    }
  };

  const onClickPay = () => {
    if (useWallet === 'default') {
      if (userBtcAddress) {
        debounceGetBTCAddress(
          userBtcAddress,
          userBtcAddress,
          quantity,
          currentFee?.rate
        );
      }
    }
  };

  const onChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (limitMint && limitMint >= Number(e.target.value)) {
      setQuantity(Number(e.target.value));
    }
  };

  const onClickMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onClickPlus = () => {
    if (limitMint && limitMint >= quantity + 1) {
      setQuantity(quantity + 1);
    }
  };

  const getBTCAddress = async (
    walletAddress: string,
    refundAddress: string,
    _quantity: number,
    _rate?: number
  ): Promise<void> => {
    if (!projectData) return;

    try {
      setIsLoading(true);
      setReceiverAddress(null);
      setErrMessage('');

      const { address, price, networkFeeByPayType, mintPriceByPayType } =
        await generateMintReceiverAddress({
          walletAddress,
          projectID: projectData.tokenID,
          payType: 'btc',
          refundUserAddress: refundAddress,
          quantity: _quantity,
          feeRate: _rate,
        });
      // const { address, Price: price } = await generateBTCReceiverAddress({
      //   walletAddress,
      //   projectID: projectData.tokenID,
      // });
      setTotalPrice(price);
      setFeePrice(networkFeeByPayType);
      setMintPrice(mintPriceByPayType);
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof err === 'string') {
        setErrMessage(`${err}`);
      } else {
        setErrMessage('failed to generate receiver address');
      }
      setReceiverAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetBTCAddress = useCallback(
    _debounce(
      (address, refundAddress, quantity, rate) =>
        getBTCAddress(address, refundAddress, quantity, rate),
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
        debounceGetBTCAddress(
          values.address,
          userBtcAddress,
          quantity,
          currentFee?.rate
        );
      }
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (addressInput !== values.address) {
      debounceGetBTCAddress(
        values.address,
        userBtcAddress,
        quantity,
        currentFee?.rate
      );
      setAddressInput(values.address);
    }
  };

  const _onClose = () => {
    setErrMessage('');
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
                      <p
                        className={s.paymentPrice_price}
                      >{`${priceFormat} BTC`}</p>
                    </div>
                    {step === 'showAddress' && (
                      <div className={s.paymentPrice}>
                        <p className={s.paymentPrice_title}>Inscription fee</p>
                        <p
                          className={s.paymentPrice_price}
                        >{`${feePriceFormat} BTC`}</p>
                      </div>
                    )}
                    <div
                      className={s.paymentPrice}
                      style={{ marginTop: 4, marginBottom: 8 }}
                    >
                      <p className={s.paymentPrice_title}>Quantity</p>
                      {step === 'info' ? (
                        <div className={s.paymentPrice_inputContainer}>
                          <SvgInset
                            className={`${
                              quantity <= 1
                                ? s.paymentPrice_inputContainer_icon_disable
                                : s.paymentPrice_inputContainer_icon
                            }`}
                            size={18}
                            svgUrl={`${CDN_URL}/icons/ic-minus.svg`}
                            onClick={onClickMinus}
                          />
                          <input
                            type="number"
                            name="quantity"
                            placeholder=""
                            value={`${quantity}`}
                            onChange={onChangeQuantity}
                            className={s.paymentPrice_inputContainer_input}
                          />
                          <SvgInset
                            className={`${
                              limitMint && quantity >= limitMint
                                ? s.paymentPrice_inputContainer_icon_disable
                                : s.paymentPrice_inputContainer_icon
                            }`}
                            size={18}
                            svgUrl={`${CDN_URL}/icons/ic-plus.svg`}
                            onClick={onClickPlus}
                          />
                        </div>
                      ) : (
                        <p className={s.paymentPrice_price}>{quantity}</p>
                      )}
                    </div>

                    {step === 'info' && projectFeeRate && (
                      <FeeRate
                        feeRate={projectFeeRate}
                        selectedRateType={rateType}
                        handleChangeRateType={handleChangeRateType}
                        useCustomRate={true}
                        handleChangeCustomRate={handleChangeCustomRate}
                        customRate={customRate}
                        payType="btc"
                      />
                    )}

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
                        <p className={s.text}>{`${
                          step === 'info' ? '~ ' : ''
                        }${totalPriceFormat} BTC`}</p>
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
                              disabled={
                                isLoading || quantity === 0 || !currentFee
                              }
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
                        disabled={isLoading || quantity === 0 || !currentFee}
                        onClick={onClickPay}
                      >
                        Pay
                      </ButtonIcon>
                    )}

                    {!!errMessage && (
                      <div className={s.error}>
                        {capitalizeFirstLetter(errMessage)}
                      </div>
                    )}

                    {step === 'info' && isLoading && (
                      <div className={s.loadingWrapper}>
                        <Loading isLoaded={false} />
                      </div>
                    )}
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
