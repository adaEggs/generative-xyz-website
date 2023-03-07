import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useState } from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { Loading } from '@components/Loading';
import { validateBTCAddressTaproot, validateEVMAddress } from '@utils/validate';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import {
  getListingFee,
  postMarketplaceBtcListNFT,
} from '@services/marketplace-btc';
import Text from '@components/Text';
import BigNumber from 'bignumber.js';
import ButtonIcon from '@components/ButtonIcon';
import { formatUnixDateTime } from '@utils/time';
import { debounce } from 'lodash';
import cs from 'classnames';
import {
  IListingFee,
  IPostMarketplaceBtcListNFTForms,
} from '@interfaces/api/marketplace-btc';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';

// const FEE_CHARGE_PERCENT = 0.1;
const MIN_PRICE = 0.005;
const INITIAL_LISTING_FEE: IListingFee = {
  serviceFee: 0,
  royaltyFee: 0,
  royaltyAddress: '',
  serviceAddress: '',
  projectID: '',
};

interface IProps {
  showModal: boolean;
  onClose: () => void;
  ordAddress: string;
}

const LOG_PREFIX = 'ListForSaleModal';

const ListForSaleModal = ({
  showModal,
  onClose,
  ordAddress,
}: IProps): JSX.Element => {
  const user = useAppSelector(getUserSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [expireTime, setExpireTime] = useState('');
  const [step, setsTep] = useState<'info' | 'list' | 'thank'>('info');
  const [ordLink, setOrdLink] = useState('');
  const [listingFee, setListingFee] = React.useState<IListingFee>({
    ...INITIAL_LISTING_FEE,
  });

  const [useEth, setUseEth] = useState(false);

  const onClickCheckboxEth = () => {
    setUseEth(!useEth);
  };

  const validateForm = (values: IPostMarketplaceBtcListNFTForms) => {
    const errors: Record<string, string> = {};

    if (!values.receiveAddress) {
      errors.receiveAddress = 'Address is required.';
    } else if (!validateBTCAddressTaproot(values.receiveAddress)) {
      errors.receiveAddress = 'Invalid wallet address.';
    }

    if (useEth) {
      if (!values.receiveETHAddress) {
        errors.receiveETHAddress = 'Address is required.';
      } else if (!validateEVMAddress(values.receiveETHAddress)) {
        errors.receiveETHAddress = 'Invalid wallet address.';
      }
    }

    if (!values.receiveOrdAddress) {
      errors.receiveOrdAddress = 'Address is required.';
    } else if (!validateBTCAddressTaproot(values.receiveOrdAddress)) {
      errors.receiveOrdAddress = 'Invalid wallet address.';
    }

    if (!values.price) {
      errors.price = 'Price is required.';
    } else if (new BigNumber(values.price).lt(MIN_PRICE)) {
      errors.price = `Minimum price is ${MIN_PRICE} BTC.`;
    }
    if (!values.inscriptionID) {
      errors.inscriptionID = 'Inscription link is required.';
    }
    return errors;
  };

  const handleSubmit = async (_data: IPostMarketplaceBtcListNFTForms) => {
    try {
      setIsLoading(true);
      const data = {
        ordWalletAddress: ordAddress,
        payType: useEth
          ? { btc: _data.receiveAddress, eth: _data.receiveETHAddress }
          : { btc: _data.receiveAddress },
        inscriptionID: _data.inscriptionID,
        name: _data.name,
        description: _data.description,
        price: _data.price,
      };
      const res = await postMarketplaceBtcListNFT({
        ...data,
        price: new BigNumber(_data.price || 0).multipliedBy(1e8).toString(),
      });
      if (res.receiveAddress) {
        setsTep('list');
        setReceiveAddress(res.receiveAddress);
        setExpireTime(res.timeoutAt);
      }
      // console.log(data);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListingFee = async (ordLink: string) => {
    if (!ordLink) return setListingFee({ ...INITIAL_LISTING_FEE });
    try {
      setIsLoading(true);
      const listingFee = await getListingFee({
        inscriptionID: ordLink,
      });
      setListingFee(listingFee);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetListingFee = React.useCallback(
    debounce(handleGetListingFee, 500),
    []
  );

  const convertFee = (price: number, charge: number) => {
    return (
      new BigNumber(price || 0).multipliedBy(charge / 100).toFixed() + ' BTC'
    );
  };

  const handleClose = () => {
    setsTep('info');
    setReceiveAddress('');
    setExpireTime('');
    setIsLoading(false);
    setOrdLink('');
    setListingFee({ ...INITIAL_LISTING_FEE });
    onClose();
  };

  React.useEffect(() => {
    debounceGetListingFee(ordLink);
  }, [ordLink]);

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
                  <h3 className={s.modalTitle}>List for sale</h3>
                  <div className={s.formWrapper}>
                    <Formik
                      key="mintBTCGenerativeForm"
                      initialValues={{
                        inscriptionID: '',
                        name: '',
                        description: '',
                        price: '',
                        receiveAddress: ordAddress,
                        receiveETHAddress: user ? user.walletAddress : '',
                        receiveOrdAddress: ordAddress,
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
                              Enter your inscription link on ordinals.com{' '}
                              <sup className={s.requiredTag}>*</sup>
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="inscriptionID"
                                type="text"
                                name="inscriptionID"
                                onChange={e => {
                                  handleChange(e);
                                  setOrdLink(e.target.value);
                                }}
                                onBlur={handleBlur}
                                value={values.inscriptionID}
                                className={s.input}
                                placeholder="https://ordinals.com/inscription/abcd12345"
                              />
                            </div>
                            {errors.inscriptionID && touched.inscriptionID && (
                              <p className={s.inputError}>
                                {errors.inscriptionID}
                              </p>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="price">
                              Set a price<sup className={s.requiredTag}>*</sup>
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
                                placeholder="0.00"
                              />
                              <div className={s.inputPostfix}>BTC</div>
                            </div>
                            {errors.price && touched.price && (
                              <p className={s.inputError}>{errors.price}</p>
                            )}
                            <div className={s.checkBoxContainer}>
                              <SvgInset
                                className={s.checkBoxIc}
                                size={18}
                                svgUrl={`${CDN_URL}/icons/${
                                  useEth ? 'ic_checkboxed' : 'ic_checkbox'
                                }.svg`}
                                onClick={onClickCheckboxEth}
                              />
                              <p className={s.checkBoxlabel}>
                                {`I'd like to receive payment in ETH too.`}
                              </p>
                            </div>
                          </div>
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="receiveAddress">
                              Enter your BTC address to receive payment{' '}
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
                                placeholder="Paste your BTC address here"
                              />
                            </div>
                            {errors.receiveAddress &&
                              touched.receiveAddress && (
                                <p className={s.inputError}>
                                  {errors.receiveAddress}
                                </p>
                              )}
                            {useEth && (
                              <>
                                <label
                                  style={{ marginTop: 16 }}
                                  className={s.label}
                                  htmlFor="receiveAddress"
                                >
                                  Enter your ETH address to receive payment{' '}
                                  <sup className={s.requiredTag}>*</sup>
                                </label>
                                <div className={s.inputContainer}>
                                  <input
                                    id="receiveETHAddress"
                                    type="address"
                                    name="receiveETHAddress"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.receiveETHAddress}
                                    className={s.input}
                                    placeholder="Paste your ETH address here"
                                  />
                                </div>
                                {errors.receiveETHAddress &&
                                  touched.receiveETHAddress && (
                                    <p className={s.inputError}>
                                      {errors.receiveETHAddress}
                                    </p>
                                  )}
                              </>
                            )}
                          </div>
                          <div className={s.formItem}>
                            <label
                              className={s.label}
                              htmlFor="receiveOrdAddress"
                            >
                              Enter the return Ordinals-compatible BTC address
                              to receive your inscription back in case you
                              cancel this listing{' '}
                              <sup className={s.requiredTag}>*</sup>
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
                              {/*        This is the address you will receive your*/}
                              {/*        inscription back if you cancel the sale in*/}
                              {/*        the future.*/}
                              {/*      </Text>*/}
                              {/*    </Tooltip>*/}
                              {/*  }*/}
                              {/*>*/}
                              {/*  <span className={s.question}>?</span>*/}
                              {/*</OverlayTrigger>*/}
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="receiveOrdAddress"
                                type="address"
                                name="receiveOrdAddress"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.receiveOrdAddress}
                                className={s.input}
                                placeholder="Paste your Ordinals-compatible BTC address here"
                              />
                            </div>
                            {errors.receiveOrdAddress &&
                              touched.receiveOrdAddress && (
                                <p className={s.inputError}>
                                  {errors.receiveOrdAddress}
                                </p>
                              )}
                          </div>
                          {/*<div className={s.formItem}>*/}
                          {/*  <label className={s.label} htmlFor="name">*/}
                          {/*    Enter the inscription name (optional){' '}*/}
                          {/*    <sup className={s.requiredTag}>*</sup>*/}
                          {/*  </label>*/}
                          {/*  <div className={s.inputContainer}>*/}
                          {/*    <input*/}
                          {/*      id="name"*/}
                          {/*      type="text"*/}
                          {/*      name="name"*/}
                          {/*      onChange={handleChange}*/}
                          {/*      onBlur={handleBlur}*/}
                          {/*      value={values.name}*/}
                          {/*      className={s.input}*/}
                          {/*      // placeholder="Input your Inscription Name here"*/}
                          {/*    />*/}
                          {/*  </div>*/}
                          {/*  {errors.name && touched.name && (*/}
                          {/*    <p className={s.inputError}>{errors.name}</p>*/}
                          {/*  )}*/}
                          {/*</div>*/}
                          <div className={s.formItem}>
                            <label className={s.label} htmlFor="description">
                              Enter the inscription description (optional){' '}
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
                                // placeholder="Input your description here"
                              />
                            </div>
                          </div>
                          <div className={s.divider} />
                          <div className={s.wrap_fee}>
                            <Text
                              size="16"
                              fontWeight="medium"
                              color="text-black-80"
                            >
                              Generative service fees
                            </Text>
                            <Text
                              size="16"
                              fontWeight="medium"
                              color="text-secondary-color"
                              className={s.free_fee}
                            >
                              {listingFee.serviceFee
                                ? convertFee(
                                    Number(values.price || 0),
                                    Number(listingFee.serviceFee)
                                  )
                                : 'FREE'}
                            </Text>
                          </div>
                          {!!listingFee.royaltyFee &&
                            !!Number(values.price || 0) && (
                              <div
                                className={cs(
                                  s.wrap_fee,
                                  s.wrap_fee_margin_bottom
                                )}
                              >
                                <Text
                                  size="16"
                                  fontWeight="medium"
                                  color="text-black-80"
                                >
                                  Royalty fees
                                </Text>
                                <Text
                                  size="16"
                                  fontWeight="medium"
                                  color="text-secondary-color"
                                >
                                  {convertFee(
                                    Number(values.price || 0),
                                    Number(listingFee.royaltyFee)
                                  )}
                                  &nbsp;BTC
                                </Text>
                              </div>
                            )}

                          {isLoading && (
                            <div className={s.loadingWrapper}>
                              <Loading isLoaded={false} />
                            </div>
                          )}

                          <ButtonIcon
                            sizes="large"
                            type="submit"
                            className={s.ctaButton}
                            disabled={isLoading}
                          >
                            Next
                          </ButtonIcon>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              )}
              {step === 'list' && (
                <>
                  <h3 className={s.modalTitle}>
                    Send your inscription to the following address
                  </h3>
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
                      {!!expireTime && (
                        <p className={s.expire}>
                          Expires at:{' '}
                          {formatUnixDateTime({ dateTime: Number(expireTime) })}
                        </p>
                      )}
                      <p className={s.btcAddress}>{receiveAddress}</p>

                      <ButtonIcon
                        sizes="large"
                        className={s.ctaButton}
                        onClick={() => setsTep('thank')}
                      >
                        <Text as="span" size="14" fontWeight="medium">
                          Already Sent
                        </Text>
                      </ButtonIcon>
                    </div>
                  </div>
                </>
              )}
              {step === 'thank' && (
                <>
                  <h3 className={s.modalTitle}>Thank you for being patient.</h3>
                  <div className={s.info_guild}>
                    It might take ~10 minutes to completely list your Ordinal on
                    Trade for sale.
                  </div>
                  <div className={s.ctas}>
                    <ButtonIcon
                      type="button"
                      sizes="large"
                      // variants={'ghost'}
                      className={s.ctaButton}
                      onClick={handleClose}
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
