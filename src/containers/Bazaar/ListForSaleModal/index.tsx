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
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

interface IFormValue {
  address: string;
  ordinals: string;
  name: string;
  description: string;
  price: string;
}
interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const LOG_PREFIX = 'ListForSaleModal';

const ListForSaleModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setsTep] = useState<'info' | 'list'>('info');
  const router = useRouter();

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCWalletAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    }
    if (!values.price) {
      errors.price = 'Price is required.';
    }

    return errors;
  };

  const handleSubmit = async (_data: IFormValue) => {
    try {
      setIsLoading(true);
      setsTep('list');
      // todo: call api
      // console.log(data);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  // const goBazaarPage = () => {
  //   router.push(ROUTE_PATH.BAZAAR);
  // };

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
              {step === 'info' ? (
                <div>
                  <h3 className={s.modalTitle}>List your NFT</h3>
                  <div className={s.alert_info}>
                    Do not spend any satoshis from this wallet unless you
                    understand what you are doing. If you ignore this warning,
                    you could inadvertently lose access to your ordinals and
                    inscriptions.
                  </div>
                  <div className={s.formWrapper}>
                    <Formik
                      key="mintBTCGenerativeForm"
                      initialValues={{
                        ordinals: '',
                        name: '',
                        description: '',
                        price: '',
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
                            <label className={s.label} htmlFor="ordinals">
                              Ordinals Link{' '}
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="ordinals"
                                type="text"
                                name="ordinals"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.ordinals}
                                className={s.input}
                                placeholder="Paste your BTC Ordinal link here"
                              />
                            </div>
                            {errors.ordinals && touched.ordinals && (
                              <p className={s.inputError}>{errors.ordinals}</p>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="name">
                              NFT Name{' '}
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="name"
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className={s.input}
                                placeholder="Paste your NFT Name here"
                              />
                            </div>
                            {errors.name && touched.name && (
                              <p className={s.inputError}>{errors.name}</p>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="description">
                              Description{' '}
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="description"
                                type="text"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className={s.input}
                                placeholder="Paste your description here"
                              />
                            </div>
                            {errors.address && touched.address && (
                              <p className={s.inputError}>{errors.ordinals}</p>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="price">
                              Price <sup className={s.requiredTag}>*</sup>
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="price"
                                type="number"
                                name="price"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                                className={s.input}
                                placeholder="Paste your price here"
                              />
                              <div className={s.inputPostfix}>BTC</div>
                            </div>
                            {errors.price && touched.price && (
                              <p className={s.inputError}>{errors.price}</p>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="address">
                              Transfer NFT to{' '}
                              <sup className={s.requiredTag}>*</sup>
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="address"
                                type="address"
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
                          {isLoading && (
                            <div className={s.loadingWrapper}>
                              <Loading isLoaded={false}></Loading>
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
              ) : (
                <>
                  <h3 className={s.modalTitle}>Send your NFT</h3>
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
                      <p className={s.btcAddress}>
                        {'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'}
                      </p>
                    </div>
                    {/* <div className={s.ctas}>
                      <Button
                        type="submit"
                        variants={'ghost'}
                        className={s.submitBtn}
                        onClick={goBazaarPage}
                      >
                        Check out bazaar
                      </Button>
                    </div> */}
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
