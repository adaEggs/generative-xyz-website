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
import {
  IPostMarketplaceBtcListNFTParams,
  postMarketplaceBtcListNFT,
} from '@services/marketplace-btc';
import Text from '@components/Text';
import BigNumber from 'bignumber.js';
import ButtonIcon from '@components/ButtonIcon';

const FEE_CHARGE_PERCENT = 0.1;

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const LOG_PREFIX = 'ListForSaleModal';

const ListForSaleModal = ({ showModal, onClose }: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [step, setsTep] = useState<'info' | 'list' | 'thank'>('info');

  const validateForm = (values: IPostMarketplaceBtcListNFTParams) => {
    const errors: Record<string, string> = {};

    if (!values.receiveAddress) {
      errors.receiveAddress = 'Wallet address is required.';
    } else if (!validateBTCWalletAddress(values.receiveAddress)) {
      errors.receiveAddress = 'Invalid wallet address.';
    }
    if (!values.price) {
      errors.price = 'Price is required.';
    }

    return errors;
  };

  const handleSubmit = async (_data: IPostMarketplaceBtcListNFTParams) => {
    try {
      setIsLoading(true);
      const res = await postMarketplaceBtcListNFT({
        ..._data,
        price: new BigNumber(_data.price || 0).multipliedBy(1e8).toString(),
      });
      if (res.receiveAddress) {
        setsTep('list');
        setReceiveAddress(res.receiveAddress);
      }
      // console.log(data);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setsTep('info');
    setReceiveAddress('');
    setIsLoading(false);
    onClose();
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
                onClick={handleClose}
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
                        inscriptionID: '',
                        name: '',
                        description: '',
                        price: '',
                        receiveAddress: '',
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
                            <label className={s.label} htmlFor="inscriptionID">
                              Ordinal Link{' '}
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="inscriptionID"
                                type="text"
                                name="inscriptionID"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.inscriptionID}
                                className={s.input}
                                placeholder="Paste your BTC Ordinal link here"
                              />
                            </div>
                            {errors.inscriptionID && touched.inscriptionID && (
                              <p className={s.inputError}>
                                {errors.inscriptionID}
                              </p>
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
                            <label className={s.label} htmlFor="receiveAddress">
                              Enter your Ordinals-compatible BTC address{' '}
                              <sup className={s.requiredTag}>*</sup>
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="receiveAddress"
                                type="address"
                                name="receiveAddress"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.receiveAddress}
                                className={s.input}
                                placeholder="Paste your BTC wallet address here"
                              />
                            </div>
                            {errors.receiveAddress &&
                              touched.receiveAddress && (
                                <p className={s.inputError}>
                                  {errors.receiveAddress}
                                </p>
                              )}
                          </div>
                          <div className={s.divider} />
                          <div className={s.wrap_fee}>
                            <Text
                              size="16"
                              fontWeight="medium"
                              color="text-black-80"
                            >
                              Service fee
                            </Text>
                            <Text
                              size="16"
                              fontWeight="medium"
                              color="text-black-80"
                            >
                              {new BigNumber(values.price || 0)
                                .multipliedBy(FEE_CHARGE_PERCENT)
                                .toString()}{' '}
                              BTC
                            </Text>
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
              )}
              {step === 'list' && (
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
                        value={receiveAddress}
                      />
                      <p className={s.btcAddress}>{receiveAddress}</p>

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
              {step === 'thank' && (
                <>
                  <h3 className={s.modalTitle}>Thank you for being patient.</h3>
                  <div className={s.info_guild}>
                    It might take a few minutes to completely list your Ordinal
                    on Bazaar for sale.
                  </div>
                  <div className={s.ctas}>
                    <Button
                      type="button"
                      variants={'ghost'}
                      className={s.submitBtn}
                      onClick={handleClose}
                    >
                      Browse Ordinals on Bazaar
                    </Button>
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
