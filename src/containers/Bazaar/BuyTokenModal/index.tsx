import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useState } from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { Loading } from '@components/Loading';
import { validateBTCWalletAddress } from '@utils/validate';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';

interface IFormValue {
  address: string;
}
interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const LOG_PREFIX = 'BuyModal';

const ListForSaleModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setsTep] = useState<'info' | 'pasteAddress' | 'showAddress'>(
    'info'
  );

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCWalletAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    }
    return errors;
  };

  const handleSubmit = async (_data: IFormValue) => {
    try {
      setIsLoading(true);
      // todo: call api
      // console.log(data);

      setsTep('showAddress');
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => {
                  setsTep('info');
                  onClose();
                }}
                className={s.closeBtn}
                variants="ghost"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              {step === 'info' && (
                <div>
                  <h3 className={s.modalTitle}>Setup BTC wallet address</h3>
                  <div className={s.info_guild}>
                    Please follow this step-by-step{' '}
                    <span
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      guide
                    </span>{' '}
                    to create an ord compatible wallet with Sparrow Wallet in
                    order to receive ordinals and inscriptions.
                    <div style={{ marginTop: 8 }}>
                      Disregard this step if you have already set it up.
                    </div>
                  </div>
                  <div className={s.ctas}>
                    <Button
                      type="submit"
                      variants={'ghost'}
                      className={s.submitBtn}
                      onClick={() => setsTep('pasteAddress')}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {step === 'pasteAddress' && (
                <>
                  <h3 className={s.modalTitle}>Buy NFT</h3>
                  <div className={s.formWrapper}>
                    <div className={s.formWrapper}>
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
                              <label className={s.label} htmlFor="address">
                                TRANSFER NFT TO{' '}
                                <sup className={s.requiredTag}>*</sup>
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
                                  placeholder="Paste your BTC Ordinal wallet address here"
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
                                  value="0.1"
                                  className={s.input}
                                  disabled={true}
                                  placeholder="Paste your price here"
                                />
                                <div className={s.inputPostfix}>BTC</div>
                              </div>
                            </div>
                            {isLoading && (
                              <div className={s.loadingWrapper}>
                                <Loading isLoaded={false} />
                              </div>
                            )}

                            <div className={s.ctas}>
                              <Button
                                type="submit"
                                variants={'ghost'}
                                className={s.submitBtn}
                                disabled={isLoading}
                              >
                                Next
                              </Button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </>
              )}
              {step === 'showAddress' && (
                <>
                  <h3 className={s.modalTitle}>Buy NFT</h3>
                  <div className={s.formWrapper}>
                    <div className={s.qrCodeWrapper}>
                      {/* <p className={s.qrTitle}>
                        Send NFT to this deposit address
                      </p> */}
                      <QRCodeGenerator
                        className={s.qrCodeGenerator}
                        size={128}
                        value={'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
                      />
                      <p className={s.sendBtcDesc}>
                        Send BTC to this deposit address
                      </p>
                      <p className={s.btcAddress}>
                        {'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
                      </p>
                    </div>
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
