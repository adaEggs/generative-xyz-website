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
import { MinSats } from 'generative-sdk';

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
  ({ inscriptionID, inscriptionNumber, onHide, ...rest }: IProps) => {
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
      // toast.error(_err.message);
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

    const calcAmount = (values: IFormValues) => {
      const inputAmount = convertToSatoshiNumber(values.price);

      // calc percent
      const artistPercent = new BigNumber(
        listingFee?.royaltyFee || 0
      ).dividedBy(100);
      const sellerPercent = new BigNumber(1).minus(artistPercent);

      // calc amount
      const amountArtist = new BigNumber(inputAmount)
        .multipliedBy(artistPercent)
        .toNumber();
      const amountSeller = new BigNumber(inputAmount)
        .multipliedBy(sellerPercent)
        .toNumber();

      return {
        amountArtist,
        amountSeller,
      };
    };

    const validateForm = (values: IFormValues) => {
      const errors: Record<string, string> = {};
      if (!values.price || !new BigNumber(values.price || 0)) {
        errors.price = 'Required.';
      } else if (values.price) {
        // validate fee
        const { amountArtist, amountSeller } = calcAmount(values);
        if (
          amountArtist > 0 &&
          amountArtist < MinSats &&
          !!listingFee?.royaltyFee
        ) {
          const minAmount = new BigNumber(100)
            .multipliedBy(MinSats)
            .dividedBy(listingFee?.royaltyFee)
            .toNumber();
          errors.price = `The minimum amount required is ${formatBTCPrice(
            minAmount,
            '0.0',
            6
          )} BTC.`;
        } else if (amountSeller < MinSats) {
          errors.price = `The minimum amount required is ${formatBTCPrice(
            MinSats,
            '0.0',
            6
          )} BTC.`;
        }
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
        const inputAmount = convertToSatoshiNumber(values.price);

        // calc percent
        const artistPercent = new BigNumber(
          listingFee?.royaltyFee || 0
        ).dividedBy(100);
        const sellerPercent = new BigNumber(1).minus(artistPercent);

        // calc amount
        const amountArtist = Math.floor(
          new BigNumber(inputAmount).multipliedBy(artistPercent).toNumber()
        );
        const amountSeller = Math.floor(
          new BigNumber(inputAmount).multipliedBy(sellerPercent).toNumber()
        );

        await listInscription({
          paySeller: `${amountSeller}`,
          creatorAddress: amountArtist ? listingFee.royaltyAddress : '',
          payCreator: `${amountArtist}`,
          feeRate: allRate[selectedRate],
          inscriptionNumber: inscriptionNumber,
          receiver: values.receiveBTCAddress,
        });
        toast.success('Listed for sale successfully');
        setTimeout(() => {
          setLoading(false);
          window.location.reload();
          onHide();
        }, 2000);
      } catch (err: unknown) {
        setLoading(false);
        onSetError(err);
      }
    };

    const renderFee = ({ price, label, charge, isHideZero }: IFeeCharge) => {
      if ((!price || !charge) && isHideZero) return null;
      const fee = new BigNumber(price || 0)
        .multipliedBy(Number(charge || 0))
        .dividedBy(100)
        .multipliedBy(1e8);
      const isZero = fee.lte(0);
      const text = isZero
        ? 'FREE'
        : formatBTCPrice(Math.floor(fee.toNumber()), '0.0', 6) + ' BTC';

      return (
        <div className={cs(s.wrapInfo_feeRow)}>
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
      <BaseModal {...rest} onHide={onHide}>
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
                      {(!!error || (!!errors.price && !!touched.price)) && (
                        <p className={s.inputContainer_inputError}>
                          {error ? error : errors.price}
                        </p>
                      )}
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
                              {((errors.receiveBTCAddress &&
                                touched.receiveBTCAddress) ||
                                !!error) && (
                                <p className={s.inputContainer_inputError}>
                                  {error || errors.receiveBTCAddress}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      }
                    />
                    <div className={cs(s.wrapItem, s.wrapInfo)}>
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
                      {!!values.price &&
                        renderFee({
                          price: new BigNumber(values.price || 0)
                            .minus(
                              new BigNumber(values.price || 0)
                                .multipliedBy(listingFee?.royaltyFee || 0)
                                .div(100)
                            )
                            .toNumber(),
                          label: 'Receive amount',
                          charge: 100,
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
                    validateForm(values);
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
