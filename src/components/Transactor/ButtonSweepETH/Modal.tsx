import React, { useContext, useState } from 'react';
import BaseModal, { IBaseModalProps } from '@components/Transactor';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { validateBTCAddressTaproot } from '@utils/validate';
import AccordionComponent from '@components/Accordion';
import { ellipsisCenter, formatEthPrice } from '@utils/format';
import { getGenDepositAddressETH, retrieveOrders } from '@services/bitcoin';
import {
  IRespGenAddressByETH,
  IRetrieveOrdersResp,
} from '@interfaces/api/bitcoin';
import { getError } from '@utils/text';
import { Token } from '@interfaces/token';
import ButtonIcon from '@components/ButtonIcon';
import toast, { LoaderIcon } from 'react-hot-toast';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import FeeRate from '@containers/Profile/FeeRate';
import { WalletContext } from '@contexts/wallet-context';
import { useRouter } from 'next/router';
import { Col, Row } from 'react-bootstrap';
import cs from 'classnames';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { formatUnixDateTime } from '@utils/time';
import { ROUTE_PATH } from '@constants/route-path';
import { Loading } from '@components/Loading';
import { onClickCopy } from '@utils/copy';
import { debounce } from 'lodash';
import BigNumber from 'bignumber.js';

interface IFormValues {
  address: string;
}

interface IProps extends IBaseModalProps {
  tokens: Token[];
}

interface IEstimatePayload {
  receive: string;
  refundAddress: string;
  sellOrderIDs: string[];
  currentRate: number;
  isEstimate: boolean;
}

const ModalSweepBTC = React.memo(({ tokens, onHide, ...rest }: IProps) => {
  const user = useSelector(getUserSelector);
  const [step, setStep] = useState<'info' | 'generate' | 'deposit'>('info');
  const [estimating, setEstimating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { transfer } = useContext(WalletContext);
  const [isSent, setIsSent] = React.useState(false);
  const router = useRouter();
  const [ordersData, setOrdersData] = React.useState<
    IRetrieveOrdersResp | undefined
  >(undefined);

  const {
    selectedRate,
    allRate,
    customRate,
    currentRate,
    handleChangeCustomRate,
    handleChangeFee,
  } = useFeeRate();

  const [receiveAddress, setReceiveAddress] = useState<string>(
    user?.walletAddressBtcTaproot || ''
  );
  const [depositData, setDepositData] = useState<
    IRespGenAddressByETH | undefined
  >(undefined);

  const [error, setError] = useState('');
  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');

  const onSetError = (err: unknown) => {
    const _err = getError(err);
    setError(_err.message);
  };

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
      setReceiveAddress(user?.walletAddressBtcTaproot || '');
    }
  };

  const onClickUseAnother = (address: string) => {
    if (useWallet !== 'another') {
      setUseWallet('another');
      setReceiveAddress(address);
    }
  };

  const validateForm = (values: IFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.address) {
      errors.address = 'Address is required.';
    } else if (!validateBTCAddressTaproot(values.address)) {
      errors.address = 'Invalid wallet address.';
    }
    if (useWallet === 'another') {
      setReceiveAddress(values.address || '');
    }
    return errors;
  };

  const handleSubmit = async (depositData: IRespGenAddressByETH) => {
    if (!depositData) throw new Error('Estimate error.');
    try {
      setIsSent(false);
      setStep('deposit');
      setIsSubmitting(true);
      await transfer(
        depositData.eth_address,
        new BigNumber(depositData.eth_amount).div(1e18).toString()
      );
      setIsSent(true);
      toast.success('Bought inscriptions successfully');
      setIsSubmitting(false);
    } catch (err: unknown) {
      setIsSubmitting(false);
      onSetError(err);
    }
  };

  const getAvailableTokens = async () => {
    try {
      setLoading(true);
      const orders = await retrieveOrders({
        order_list: tokens.map(token => token.orderID),
      });
      setOrdersData(orders);
    } catch (err) {
      onSetError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (payload: IEstimatePayload) => {
    const { receive, isEstimate, refundAddress, sellOrderIDs, currentRate } =
      payload;
    if (!receive && !isEstimate) {
      setDepositData(undefined);
      setError('Invalid wallet address.');
      setEstimating(true);
      return;
    }
    setError('');
    let depositData: IRespGenAddressByETH | undefined = undefined;
    try {
      setLoading(true);
      depositData = await getGenDepositAddressETH({
        fee_rate: currentRate,
        order_list: sellOrderIDs,
        receive_address: receive,
        refund_address: refundAddress,
        is_estimate: isEstimate,
      });
      setDepositData(depositData);
      if (!isEstimate) {
        setStep('deposit');
      }
    } catch (err) {
      onSetError(err);
    } finally {
      setLoading(false);
      setEstimating(false);
    }
    return depositData;
  };

  const getOrderIDs = () => {
    const orderIDs = Object.keys(ordersData?.raw_psbt_list || {});
    if (!orderIDs || !orderIDs.length) {
      setError('All tokens not available for buy.');
    }
    return orderIDs;
  };

  const debounceFetchData = React.useCallback(debounce(fetchData, 300), []);

  const countItems = () => {
    const length = Object.values(ordersData?.raw_psbt_list || {}).length;
    return `${length} ${length == 1 ? 'item' : 'items'}`;
  };

  React.useEffect(() => {
    getAvailableTokens().then().catch();
  }, []);

  React.useEffect(() => {
    if (
      !user?.walletAddress ||
      step === 'deposit' ||
      step === 'generate' ||
      !ordersData
    ) {
      return;
    }
    const orderIDs = getOrderIDs();
    if (!orderIDs || !orderIDs.length) {
      return;
    }
    setEstimating(true);
    debounceFetchData({
      receive: receiveAddress,
      refundAddress: user.walletAddress,
      sellOrderIDs: orderIDs,
      currentRate: currentRate,
      isEstimate: true,
    });
  }, [receiveAddress, currentRate, user?.walletAddress, step, ordersData]);

  return (
    <BaseModal {...rest} className={s.container} onHide={onHide}>
      <div className={s.container}>
        <Formik
          key="buyListedForm"
          initialValues={{
            address: '',
          }}
          validate={validateForm}
          onSubmit={() => {
            // TODO
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <>
              {['info', 'generate'].includes(step) && (
                <form>
                  <Row className={s.row}>
                    <div className={s.payment}>
                      <p className={s.payment_title}>Price</p>
                      <p className={s.payment_price}>{`${formatEthPrice(
                        depositData?.eth_amount_origin || 0
                      )} ETH`}</p>
                    </div>
                    {!!depositData && (
                      <>
                        <div className={s.payment}>
                          <p className={s.payment_title}>Network fees</p>
                          <p className={s.payment_price}>{`${formatEthPrice(
                            depositData?.eth_fee
                          )} ETH`}</p>
                        </div>
                        <div className={s.payment}>
                          <p className={s.payment_title}>Quantity</p>
                          <p className={s.payment_price}>{countItems()}</p>
                        </div>
                        {!isLoading && error && (
                          <p className={s.inputError}>{error}</p>
                        )}
                      </>
                    )}
                    <div className={s.payment_space} />
                    <FeeRate
                      handleChangeFee={handleChangeFee}
                      selectedRate={selectedRate}
                      allRate={allRate}
                      useCustomRate={true}
                      handleChangeCustomRate={handleChangeCustomRate}
                      customRate={customRate}
                      feeType="buyETH"
                      options={{
                        hasRoyalty: !!depositData?.has_royalty,
                        feeETH: depositData?.eth_fee,
                        loading: estimating,
                        hideAmount: true,
                      }}
                    />
                  </Row>
                  {depositData && (
                    <>
                      <div className={s.payment_divider} />
                      <div className={cs(s.payment, s.payment_space)}>
                        <p className={s.payment_total}>Total</p>
                        <p className={s.payment_totalAmount}>{`${formatEthPrice(
                          depositData?.eth_amount
                        )} ETH`}</p>
                      </div>
                    </>
                  )}
                  <AccordionComponent
                    header="Advanced"
                    content={
                      <>
                        <div className={s.checkboxContainer}>
                          <div
                            className={s.checkbox}
                            onClick={onClickUseDefault}
                          >
                            <SvgInset
                              className={s.checkbox_ic}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/${
                                useWallet === 'default'
                                  ? 'ic_checkboxed'
                                  : 'ic_checkbox'
                              }.svg`}
                            />
                            <p className={s.checkbox_text}>
                              Your Generative Wallet
                            </p>
                          </div>
                          <div
                            className={s.checkbox}
                            style={{ marginLeft: 24 }}
                            onClick={() => {
                              onClickUseAnother(values.address);
                            }}
                          >
                            <SvgInset
                              className={s.checkbox_ic}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/${
                                useWallet === 'another'
                                  ? 'ic_checkboxed'
                                  : 'ic_checkbox'
                              }.svg`}
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
                              <p className={s.inputError}>{errors.address}</p>
                            )}
                          </div>
                        )}
                      </>
                    }
                  />
                  <ButtonIcon
                    className={s.buttonBuy}
                    disabled={isLoading || !countItems().length}
                    sizes="medium"
                    type="button"
                    startIcon={isLoading ? <LoaderIcon /> : null}
                    onClick={async () => {
                      if (useWallet === 'another') {
                        const errors = validateForm(values);
                        const messages = Object.values(errors || {});
                        if (!!messages && !!messages.length) {
                          return setError(Object.values(errors)[0]);
                        }
                      }

                      if (!user || !user.walletAddress) {
                        return setError('Please connect wallet.');
                      }

                      setStep('generate');

                      const data = await fetchData({
                        receive: receiveAddress,
                        refundAddress: user.walletAddress,
                        sellOrderIDs: getOrderIDs(),
                        currentRate: currentRate,
                        isEstimate: false,
                      });
                      if (data && data.order_id) {
                        handleSubmit(data).then().catch();
                      }
                    }}
                  >
                    Buy now
                  </ButtonIcon>
                  {error && <p className={s.inputError}>{error}</p>}
                </form>
              )}
              {step === 'deposit' && !!depositData?.order_id && (
                <Row className={s.deposit}>
                  <Col md="6" className={s.padding}>
                    <Row className={s.row}>
                      <div className={s.payment}>
                        <p className={s.payment_title}>Item price</p>
                        <p className={s.payment_price}>{`${formatEthPrice(
                          depositData?.eth_amount_origin || 0
                        )} ETH`}</p>
                      </div>
                      <div className={s.payment}>
                        <p className={s.payment_title}>Network fees</p>
                        <p className={s.payment_price}>{`${formatEthPrice(
                          depositData?.eth_fee || 0
                        )} ETH`}</p>
                      </div>
                      <div className={s.payment_divider2} />
                      <div className={s.payment}>
                        <p className={s.payment_total}>Total</p>
                        <p className={s.payment_totalAmount}>{`${formatEthPrice(
                          depositData?.eth_amount || '0'
                        )} ETH`}</p>
                      </div>
                    </Row>
                  </Col>
                  <Col md="6" className={cs(s.addressBox, s.padding)}>
                    <div className={s.qrCodeWrapper}>
                      <p className={s.qrTitle}>
                        Send{' '}
                        <span style={{ fontWeight: 'bold' }}>
                          {formatEthPrice(depositData?.eth_amount || 0)} ETH
                        </span>{' '}
                        to this address
                      </p>

                      <div className={s.btcAddressContainer}>
                        <p className={s.btcAddress}>
                          {ellipsisCenter({
                            str: depositData?.eth_address || '',
                            limit: 16,
                          })}
                        </p>
                        <SvgInset
                          className={s.icCopy}
                          size={18}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                          onClick={() =>
                            onClickCopy(depositData?.eth_address || '')
                          }
                        />
                      </div>

                      <QRCodeGenerator
                        className={s.qrCodeGenerator}
                        size={128}
                        value={depositData?.eth_address || ''}
                      />
                      <div className={s.expired}>
                        <p className={s.expired_title}>Expired at:</p>
                        <p className={s.expired_time}>{`${formatUnixDateTime({
                          dateTime: depositData?.expired_at || 0,
                        })}`}</p>
                      </div>
                    </div>
                    {isSent && (
                      <div className={s.btnContainer}>
                        <ButtonIcon
                          sizes="medium"
                          className={s.checkBtn}
                          onClick={() =>
                            router.push(
                              `${ROUTE_PATH.PROFILE}/${user?.walletAddressBtcTaproot}`
                            )
                          }
                          variants="outline"
                        >
                          Check order status
                        </ButtonIcon>
                        <div style={{ width: 16 }} />
                        <ButtonIcon
                          sizes="medium"
                          variants="outline"
                          className={s.buyBtn}
                          onClick={onHide}
                        >
                          Continue collecting
                        </ButtonIcon>
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              {isSubmitting && (
                <div className={s.loadingWrapper}>
                  <Loading isLoaded={false} />
                </div>
              )}
            </>
          )}
        </Formik>
      </div>
    </BaseModal>
  );
});

ModalSweepBTC.displayName = 'ModalSweepBTC';

export default ModalSweepBTC;
