import React, { useState } from 'react';
import BaseModal, { IBaseModalProps } from '@components/Transactor';
import s from '@components/Transactor/form.module.scss';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { validateBTCAddressTaproot } from '@utils/validate';
import BigNumber from 'bignumber.js';
import ButtonIcon from '@components/ButtonIcon';
import AccordionComponent from '@components/Accordion';
import { formatBTCPrice } from '@utils/format';
import { retrieveOrder } from '@services/bitcoin';
import { IRetrieveOrderResp } from '@interfaces/api/bitcoin';
import toast, { LoaderIcon } from 'react-hot-toast';
import { useBitcoin } from '@bitcoin/index';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import { getError } from '@utils/text';
import { Loading } from '@components/Loading';
import FeeRate from '@containers/Profile/FeeRate';

interface IFormValues {
  price: string;
  receiveBTCAddress: string;
}

interface IProps extends IBaseModalProps {
  inscriptionID: string;
  price: number | string;
  orderID: string;
  inscriptionNumber: number;
  isDetail: boolean;
}

const ModalBuyListed = React.memo(
  ({
    price,
    orderID,
    inscriptionID,
    inscriptionNumber,
    isDetail,
    ...rest
  }: IProps) => {
    const user = useSelector(getUserSelector);
    const [step, _] = useState<'buy' | 'success'>('buy');
    const [orderData, setOrderData] = useState<IRetrieveOrderResp | undefined>(
      undefined
    );
    const {
      selectedRate,
      handleChangeFee,
      allRate,
      customRate,
      currentRate,
      handleChangeCustomRate,
    } = useFeeRate();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { buyInscription, satoshiAmount } = useBitcoin({ inscriptionID });
    const [error, setError] = useState('');
    const onSetError = (err: unknown) => {
      const _err = getError(err);
      setError(_err.message);
      // toast.error(_err.message);
    };

    const validateForm = (values: IFormValues) => {
      const errors: Record<string, string> = {};

      if (!values.price || !new BigNumber(values.price || 0)) {
        errors.price = 'Required.';
      }

      if (!values.receiveBTCAddress) {
        errors.receiveBTCAddress = 'Address is required.';
      } else if (!validateBTCAddressTaproot(values.receiveBTCAddress)) {
        errors.receiveAddress = 'Invalid wallet address.';
      }
      return errors;
    };

    const handleSubmit = async (values: IFormValues) => {
      if (!orderData) return;
      try {
        setIsSubmitting(true);
        await buyInscription({
          feeRate: currentRate,
          inscriptionNumber: inscriptionNumber,
          price: Number(price),
          receiverInscriptionAddress: values.receiveBTCAddress,
          sellerSignedPsbtB64: orderData.raw_psbt,
        });
        toast.success('Bought inscription successfully');
        setTimeout(() => {
          setIsSubmitting(false);
          window.location.reload();
          setError('');
        }, 2000);
      } catch (err: unknown) {
        setIsSubmitting(false);
        onSetError(err);
      }
    };

    const fetchRetrieve = async () => {
      try {
        setLoading(true);
        const order = await retrieveOrder({ orderID });
        setOrderData(order);
      } catch (err) {
        onSetError(err);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      fetchRetrieve().then().catch();
    }, []);

    return (
      <BaseModal {...rest} className={s.modal}>
        <div className={s.container}>
          <Formik
            key="buyListedForm"
            initialValues={{
              price: `${price}` || '',
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
                {step === 'buy' && (
                  <>
                    <div className={s.wrapItem}>
                      <div className={s.wrapItem_rowBetween}>
                        <label className={s.wrapItem_label} htmlFor="amount">
                          Price
                        </label>
                        <label className={s.wrapItem_label} htmlFor="amount">
                          Balance: {formatBTCPrice(satoshiAmount.toString())}{' '}
                          BTC
                        </label>
                      </div>
                      <div className={s.inputContainer}>
                        <input
                          id="price"
                          type="number"
                          name="price"
                          min="0"
                          disabled={true}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={formatBTCPrice(price)}
                          className={s.inputContainer_input}
                          placeholder="0.00"
                        />
                        <div className={s.inputContainer_inputPostfix}>BTC</div>
                      </div>
                      {!!error && (
                        <p className={s.inputContainer_inputError}>{error}</p>
                      )}
                    </div>
                    <FeeRate
                      handleChangeFee={handleChangeFee}
                      selectedRate={selectedRate}
                      allRate={allRate}
                      handleChangeCustomRate={handleChangeCustomRate}
                      customRate={customRate}
                      feeType="buyBTC"
                      useCustomRate={true}
                    />
                    <AccordionComponent
                      header="Advanced"
                      content={
                        <div className={s.advancedContent}>
                          <div className={s.wrapItem}>
                            <label
                              className={s.wrapItem_label}
                              htmlFor="receiveBTCAddress"
                            >
                              Enter your Ordinals-compatible BTC address to
                              receive inscription
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
                                placeholder="Paste your Ordinals-compatible BTC address here"
                                disabled={isLoading}
                              />
                              {errors.receiveBTCAddress &&
                                touched.receiveBTCAddress && (
                                  <p className={s.inputContainer_inputError}>
                                    {errors.receiveBTCAddress}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      }
                    />
                    <div>
                      <Loading isLoaded={!isSubmitting} />
                    </div>
                    {isDetail ? (
                      <ButtonIcon
                        className={s.btnSend}
                        disabled={isLoading}
                        sizes="medium"
                        type="submit"
                        startIcon={isLoading ? <LoaderIcon /> : null}
                      >
                        Buy now
                      </ButtonIcon>
                    ) : (
                      <ButtonIcon
                        className={s.btnSend}
                        disabled={isLoading}
                        sizes="medium"
                        type="submit"
                        startIcon={isLoading ? <LoaderIcon /> : null}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          validateForm(values);
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          handleSubmit(values);
                        }}
                      >
                        Buy now
                      </ButtonIcon>
                    )}
                  </>
                )}
              </form>
            )}
          </Formik>
        </div>
      </BaseModal>
    );
  }
);

ModalBuyListed.displayName = 'ModalBuyListedBTC';

export default ModalBuyListed;
