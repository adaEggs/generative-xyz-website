import Button from '@components/ButtonIcon';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { validateBTCAddress } from '@utils/validate';
import useBitcoin from '@bitcoin/useBitcoin';
import * as GENERATIVE_SDK from 'generative-sdk';
import cs from 'classnames';
import { formatBTCPrice } from '@utils/format';
import { FeeRateName } from '@interfaces/api/bitcoin';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { setStorageIns } from '@containers/Profile/Collected/Modal/SendInscription/utils';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import Text from '@components/Text';
import { getError } from '@utils/text';
import { AssetsContext } from '@contexts/assets-context';
import SDK from '@utils/sdk';

interface IFormValue {
  address: string;
}
interface IProps {
  showModal: boolean;
  onClose: () => void;
  inscriptionID: string;
  inscriptionNumber: number;
}

const SendInscriptionModal = ({
  showModal,
  onClose,
  inscriptionID,
  inscriptionNumber,
}: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    currentAssets,
    debounceFetchData,
    feeRate: _FEE_RATE,
  } = useContext(AssetsContext);
  const FEE_RATE = _FEE_RATE || {
    fastestFee: 15,
    halfHourFee: 10,
    hourFee: 5,
  };
  const user = useSelector(getUserSelector);
  const [feeRate, setFeeRate] = useState<FeeRateName>(FeeRateName.halfHourFee);
  const { sendInscription } = useBitcoin({
    inscriptionID: inscriptionID,
  });

  const handleChangeFee = (fee: FeeRateName): void => {
    setFeeRate(fee);
  };

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Address is required.';
    } else if (!validateBTCAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else if (
      !!user?.walletAddressBtcTaproot &&
      values.address === user?.walletAddressBtcTaproot
    ) {
      errors.address =
        'Invalid wallet address. Please send the inscription to another wallet address.';
    }
    try {
      SDK.amountValidator({
        amount: '0',
        assets: currentAssets,
        inscriptionID,
        feeRate: FEE_RATE[feeRate],
      });
    } catch (err) {
      errors.address =
        getError(err)?.message || 'Your BTC balance is insufficient.';
    }
    return errors;
  };

  const handleSubmit = async (_data: IFormValue) => {
    try {
      setIsLoading(true);
      await sendInscription({
        inscriptionNumber: inscriptionNumber,
        receiverAddress: _data.address,
        feeRate: FEE_RATE[feeRate],
      });
      toast.success('Transferred successfully');
      onClose();
      setStorageIns(inscriptionID);
    } catch (err: unknown) {
      // handle error
      toast.error(ErrorMessage.DEFAULT);
      onClose();
    } finally {
      // setIsLoading(false);
      setIsLoading(false);
      debounceFetchData();
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  if (!showModal || !currentAssets) {
    return <></>;
  }

  return (
    <div className={s.container}>
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
              <>
                <h3 className={s.modalTitle}>Send inscription</h3>
                <div className={s.formWrapper}>
                  <Formik
                    key="SendInscriptionForm"
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
                            To
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
                              placeholder="Recipient Bitcoin address"
                            />
                          </div>
                          {errors.address && touched.address && (
                            <p className={s.inputError}>{errors.address}</p>
                          )}
                        </div>
                        <Text
                          size="18"
                          fontWeight="medium"
                          style={{ marginTop: 32 }}
                        >
                          Select the network fee you want to pay:
                        </Text>
                        <div className={s.mintFeeWrapper}>
                          <div
                            onClick={() => {
                              handleChangeFee(FeeRateName.hourFee);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === FeeRateName.hourFee,
                            })}
                          >
                            <p className={s.feeTitle}>Economy</p>
                            <p
                              className={s.feeDetail}
                            >{`${FEE_RATE?.hourFee} sats/vByte`}</p>
                            <p className={s.feeTotal}>
                              ~{' '}
                              {`${formatBTCPrice(
                                GENERATIVE_SDK.estimateTxFee(
                                  2,
                                  2,
                                  FEE_RATE?.hourFee
                                )
                              )} BTC`}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              handleChangeFee(FeeRateName.halfHourFee);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === FeeRateName.halfHourFee,
                            })}
                          >
                            <p className={s.feeTitle}>Faster</p>
                            <p
                              className={s.feeDetail}
                            >{`${FEE_RATE?.halfHourFee} sats/vByte`}</p>
                            <p className={s.feeTotal}>
                              ~{' '}
                              {`${formatBTCPrice(
                                GENERATIVE_SDK.estimateTxFee(
                                  2,
                                  2,
                                  FEE_RATE?.halfHourFee
                                )
                              )} BTC`}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              handleChangeFee(FeeRateName.fastestFee);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === FeeRateName.fastestFee,
                            })}
                          >
                            <p className={s.feeTitle}>Fastest</p>
                            <p
                              className={s.feeDetail}
                            >{`${FEE_RATE?.fastestFee} sats/vByte`}</p>
                            <p className={s.feeTotal}>
                              ~{' '}
                              {`${formatBTCPrice(
                                GENERATIVE_SDK.estimateTxFee(
                                  2,
                                  2,
                                  FEE_RATE?.fastestFee
                                )
                              )} BTC`}
                            </p>
                          </div>
                        </div>
                        {isLoading && (
                          <div className={s.loadingWrapper}>
                            <Loading isLoaded={false} />
                          </div>
                        )}
                        <ButtonIcon
                          disabled={isLoading}
                          type="submit"
                          className={s.sendBtn}
                        >
                          Send
                        </ButtonIcon>
                      </form>
                    )}
                  </Formik>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendInscriptionModal;
