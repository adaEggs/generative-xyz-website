import React, { useState } from 'react';
import BaseModal, { IBaseModalProps } from '@components/Transactor';
import s from '@components/Transactor/form.module.scss';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { validateBTCAddress } from '@utils/validate';
import BigNumber from 'bignumber.js';
import ButtonIcon from '@components/ButtonIcon';
import AccordionComponent from '@components/Accordion';
import { getListingFee } from '@services/marketplace-btc';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { IListingFee } from '@interfaces/api/marketplace-btc';
import Text from '@components/Text';
import cs from 'classnames';
import { convertToSatoshiNumber, formatBTCPrice } from '@utils/format';
import { useBitcoin } from '@bitcoin/index';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import { getError } from '@utils/text';

interface IFormValues {
  price: string;
  receiveBTCAddress: string;
}

interface IFeeCharge {
  price: number | string;
  charge: number | string;
  label: string;
  isHideZero: boolean;
}

const LOG_PREFIX = 'ListForSaleModal';

interface IProps extends IBaseModalProps {
  inscriptionID: string;
  inscriptionNumber: number;
}

const step = 'list';
const ModalListForSale = React.memo(
  ({ inscriptionID, inscriptionNumber, ...rest }: IProps) => {
    const user = useSelector(getUserSelector);
    // const [step, setStep] = useState<'list' | 'success'>('list');
    const { selectedRate, allRate } = useFeeRate();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [listingFee, setListingFee] = React.useState<IListingFee | undefined>(
      undefined
    );
    const { listInscription } = useBitcoin({ inscriptionID });
    const [error, setError] = useState('');

    const onSetError = (err: unknown) => {
      const _err = getError(err);
      setError(_err.message);
      toast.error(_err.message);
    };

    const onGetListingFee = async () => {
      if (!inscriptionID) {
        return setListingFee(undefined);
      }
      try {
        setLoading(true);
        const listingFee = await getListingFee({
          inscriptionID,
        });
        setListingFee(listingFee);
      } catch (err: unknown) {
        log(err as Error, LogLevel.ERROR, LOG_PREFIX);
        toast.error(ErrorMessage.DEFAULT);
      } finally {
        setLoading(false);
      }
    };

    const validateForm = (values: IFormValues) => {
      const errors: Record<string, string> = {};

      if (!values.price || !new BigNumber(values.price || 0)) {
        errors.price = 'Required.';
      }
      if (!values.receiveBTCAddress) {
        errors.receiveBTCAddress = 'Address is required.';
      } else if (!validateBTCAddress(values.receiveBTCAddress)) {
        errors.receiveAddress = 'Invalid wallet address.';
      }

      return errors;
    };

    const handleSubmit = async (values: IFormValues) => {
      if (!listingFee) return;
      try {
        setLoading(true);
        const satoshiAmount = convertToSatoshiNumber(values.price);
        let amountArtist = 0;
        if (listingFee?.royaltyFee) {
          amountArtist = new BigNumber(satoshiAmount)
            .multipliedBy(listingFee?.royaltyFee)
            .div(100)
            .toNumber();
          amountArtist = Math.floor(amountArtist);
        }

        let amountSeller = new BigNumber(satoshiAmount)
          .minus(amountArtist)
          .toNumber();
        amountSeller = Math.floor(amountSeller);

        await listInscription({
          amountPayToSeller: amountSeller,
          creatorAddress: '',
          feePayToCreator: 0,
          feeRate: allRate[selectedRate],
          inscriptionNumber: inscriptionNumber,
          receiverBTCAddress: values.receiveBTCAddress,
        });
      } catch (err: unknown) {
        setLoading(false);
        onSetError(err);
      }
    };

    const renderFee = ({ price, label, charge, isHideZero }: IFeeCharge) => {
      if ((!price || !charge) && isHideZero) return null;
      const satoshiFee = new BigNumber(price || 0).multipliedBy(
        Number(charge || 0) / 100
      );

      const isZero = satoshiFee.lte(0);
      const text = isZero ? 'FREE' : formatBTCPrice(satoshiFee.toString());

      return (
        <div className={cs(s.wrapFee_feeRow)}>
          <Text size="16" fontWeight="medium" color="text-black-80">
            {label}
          </Text>
          <Text size="16" fontWeight="medium" color="text-secondary-color">
            {text}
          </Text>
        </div>
      );
    };

    React.useEffect(() => {
      onGetListingFee().then().catch();
    }, []);

    return (
      <BaseModal {...rest}>
        <div className={s.container}>
          <Formik
            key="mintBTCGenerativeForm"
            initialValues={{
              price: '',
              receiveBTCAddress: user?.walletAddressBtcTaproot || '',
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
                {step === 'list' && (
                  <>
                    <div className={s.wrapItem}>
                      <label className={s.wrapItem_label} htmlFor="price">
                        Set a price
                      </label>
                      <div className={s.inputContainer}>
                        <input
                          id="price"
                          type="number"
                          name="price"
                          min="0"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.price}
                          className={s.inputContainer_input}
                          placeholder="0.00"
                        />
                        <div className={s.inputContainer_inputPostfix}>BTC</div>
                      </div>
                      {(!!errors.price && !!touched.price) ||
                        (error && (
                          <p className={s.inputContainer_inputError}>
                            {error || errors.price}
                          </p>
                        ))}
                    </div>
                    <AccordionComponent
                      header="Advanced"
                      content={
                        <div className={s.advancedContent}>
                          <div className={s.wrapItem}>
                            <label
                              className={s.wrapItem_label}
                              htmlFor="receiveAddress"
                            >
                              Enter your BTC address to receive payment
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="receiveBTCAddress"
                                type="address"
                                name="receiveBTCAddress"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.receiveBTCAddress}
                                className={s.inputContainer_input}
                                placeholder="Paste your BTC address here"
                              />
                              {errors.receiveBTCAddress &&
                                touched.receiveBTCAddress && (
                                  <p className={s.inputContainer_inputError}>
                                    {errors.receiveBTCAddress || error}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      }
                    />
                    <div className={cs(s.wrapItem, s.wrapFee)}>
                      {renderFee({
                        price: values.price,
                        label: 'Generative service fees',
                        charge: listingFee?.serviceFee || 0,
                        isHideZero: false,
                      })}
                      {renderFee({
                        price: values.price,
                        label: 'Royalty fees',
                        charge: listingFee?.royaltyFee || 0,
                        isHideZero: true,
                      })}
                    </div>
                  </>
                )}
                <ButtonIcon
                  disabled={isLoading}
                  className={s.btnSend}
                  sizes="medium"
                  type="submit"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    handleSubmit(values);
                  }}
                >
                  Listing now
                </ButtonIcon>
              </form>
            )}
          </Formik>
        </div>
      </BaseModal>
    );
  }
);

ModalListForSale.displayName = 'ModalListForSale';

export default ModalListForSale;
