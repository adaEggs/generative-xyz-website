import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useState } from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { Loading } from '@components/Loading';
import { validateBTCAddressTaproot } from '@utils/validate';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { submitAddressBuyBTC } from '@services/marketplace-btc';
import ButtonIcon from '@components/ButtonIcon';
import Text from '@components/Text';
import { useRouter } from 'next/router';
import { formatUnixDateTime } from '@utils/time';
import { ROUTE_PATH } from '@constants/route-path';
import { formatBTCPrice } from '@utils/format';

interface IFormValue {
  address: string;
}
interface IProps {
  showModal: boolean;
  onClose: () => void;
  inscriptionID: string;
  price: number;
  orderID: string;
  ordAddress: string;
}

const LOG_PREFIX = 'BuyModal';

const ListForSaleModal = ({
  showModal,
  onClose,
  price,
  inscriptionID,
  orderID,
  ordAddress,
}: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [expireTime, setExpireTime] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const router = useRouter();

  const [step, setsTep] = useState<
    'info' | 'pasteAddress' | 'showAddress' | 'thank'
  >('pasteAddress');

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Address is required.';
    } else if (!validateBTCAddressTaproot(values.address)) {
      errors.address = 'Invalid wallet address.';
    }
    return errors;
  };

  const handleSubmit = async (_data: IFormValue) => {
    try {
      setIsLoading(true);
      const data = await submitAddressBuyBTC({
        walletAddress: _data.address,
        inscriptionID,
        orderID,
        payType: 'btc',
      });
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

  const handleClose = () => {
    setsTep('pasteAddress');
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
        <div className={s.modalWrapper}>
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
            <div className={s.modalBody}>
              {(step === 'pasteAddress' || step === 'showAddress') && (
                <>
                  <h3 className={s.modalTitle}>Buy inscription</h3>
                  {/*<div className={s.alert_info}>*/}
                  {/*  Do not spend any satoshis from this wallet unless you*/}
                  {/*  understand what you are doing. If you ignore this warning,*/}
                  {/*  you could inadvertently lose access to your ordinals and*/}
                  {/*  inscriptions.*/}
                  {/*</div>*/}
                  <div className={s.formWrapper}>
                    <div className={s.formWrapper}>
                      <Formik
                        key="mintBTCGenerativeForm"
                        initialValues={{
                          address: ordAddress,
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
                              <label className={s.label} htmlFor="address">
                                Enter the Ordinals-compatible BTC address to
                                receive your buying inscription.
                                {/*Don’t have one?{' '}*/}
                                {/*<a*/}
                                {/*  href="https://gist.github.com/windsok/5b53a1ced6ef3eddbde260337de28980"*/}
                                {/*  target="_blank"*/}
                                {/*  rel="noreferrer"*/}
                                {/*>*/}
                                {/*  Start here*/}
                                {/*</a>*/}
                                {/*<OverlayTrigger*/}
                                {/*  placement="bottom"*/}
                                {/*  delay={{ show: 250, hide: 400 }}*/}
                                {/*  overlay={*/}
                                {/*    <Tooltip id="variation-tooltip">*/}
                                {/*      <Text*/}
                                {/*        size="14"*/}
                                {/*        fontWeight="semibold"*/}
                                {/*        color="primary-333"*/}
                                {/*      >*/}
                                {/*        You will either receive inscription in*/}
                                {/*        this wallet if the inscription is*/}
                                {/*        successfully bought or get your Ordinal*/}
                                {/*        back if the order is cancelled.*/}
                                {/*      </Text>*/}
                                {/*    </Tooltip>*/}
                                {/*  }*/}
                                {/*>*/}
                                {/*  <span className={s.question}>?</span>*/}
                                {/*</OverlayTrigger>*/}
                              </label>
                              <div className={s.inputContainer}>
                                <input
                                  id="address"
                                  type="text"
                                  name="address"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.address}
                                  className={s.input}
                                  placeholder="Paste your Ordinals-compatible BTC address here"
                                />
                              </div>
                              {errors.address && touched.address && (
                                <p className={s.inputError}>{errors.address}</p>
                              )}
                            </div>
                            <div className={s.formItem}>
                              <label className={s.label} htmlFor="price">
                                Price
                              </label>
                              <div className={s.inputContainer}>
                                <input
                                  id="price"
                                  type="number"
                                  name="price"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={formatBTCPrice(price || 0)}
                                  className={s.input}
                                  disabled={true}
                                  placeholder="Paste your price here"
                                />
                                <div className={s.inputPostfix}>BTC</div>
                              </div>
                            </div>
                            {!!errMessage && (
                              <div className={s.error}>{errMessage}</div>
                            )}
                            {isLoading && (
                              <div className={s.loadingWrapper}>
                                <Loading isLoaded={false} />
                              </div>
                            )}
                            {step === 'pasteAddress' && !!errMessage ? (
                              <div className={s.ctas}>
                                <Button
                                  type="button"
                                  sizes="large"
                                  // variants={'ghost'}
                                  className={s.buyBtn}
                                  disabled={isLoading}
                                  onClick={() => {
                                    handleClose();
                                  }}
                                >
                                  Sure thing
                                </Button>
                              </div>
                            ) : receiveAddress ? null : (
                              <div className={s.ctas}>
                                <ButtonIcon
                                  type="submit"
                                  sizes="large"
                                  // variants={'ghost'}
                                  className={s.buyBtn}
                                  disabled={isLoading}
                                >
                                  Generate payment address
                                </ButtonIcon>
                              </div>
                            )}
                          </form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </>
              )}
              {step === 'showAddress' && (
                <>
                  <div className={s.formWrapper} style={{ marginTop: 24 }}>
                    <div className={s.qrCodeWrapper}>
                      <p className={s.qrTitle}>
                        Send BTC to this payment address
                      </p>
                      <QRCodeGenerator
                        className={s.qrCodeGenerator}
                        size={128}
                        value={receiveAddress || ''}
                      />
                      {!!expireTime && (
                        <p className={s.expire}>
                          Expires at:{' '}
                          {formatUnixDateTime({ dateTime: Number(expireTime) })}
                        </p>
                      )}
                      <p className={s.btcAddress}>{receiveAddress || ''}</p>
                    </div>
                    <ButtonIcon
                      sizes="large"
                      className={s.buyBtn}
                      onClick={() => setsTep('thank')}
                    >
                      <Text as="span" size="14" fontWeight="medium">
                        Already Sent
                      </Text>
                    </ButtonIcon>
                  </div>
                </>
              )}
              {step === 'thank' && (
                <>
                  <h3 className={s.modalTitle}>Thank you for being patient.</h3>
                  <div className={s.info_guild}>
                    It might take ~30 minutes to completely buy the Ordinal on
                    Trade.
                  </div>
                  <div className={s.ctas}>
                    <ButtonIcon
                      type="button"
                      sizes="large"
                      // variants={'ghost'}
                      className={s.buyBtn}
                      onClick={() => {
                        router.push(ROUTE_PATH.TRADE).then(() => {
                          handleClose();
                        });
                      }}
                    >
                      Browse Ordinals on Trade
                    </ButtonIcon>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListForSaleModal;
