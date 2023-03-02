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
import { formatBTCPrice } from '@utils/format';

interface IFormValues {
  price: string;
  receiveBTCAddress: string;
}

interface IProps extends IBaseModalProps {
  inscriptionID: string;
  price: number | string;
}

const ModalBuyListed = React.memo(({ price, ...rest }: IProps) => {
  const user = useSelector(getUserSelector);
  const [step, _] = useState<'buy' | 'success'>('buy');
  const [isLoading, setLoading] = useState<boolean>(false);

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

  const handleSubmit = async (_: IFormValues) => {
    try {
      setLoading(true);
      return;
    } catch (err: unknown) {
      // TODO
    }
  };

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
              {step === 'buy' && (
                <>
                  <div className={s.wrapItem}>
                    <label className={s.wrapItem_label} htmlFor="price">
                      Price
                    </label>
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
                            Enter your BTC address to receive payments
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
                                  {errors.receiveBTCAddress}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <ButtonIcon
                    className={s.btnSend}
                    disabled={isLoading}
                    sizes="medium"
                    type="submit"
                  >
                    Buy now
                  </ButtonIcon>
                </>
              )}
            </form>
          )}
        </Formik>
      </div>
    </BaseModal>
  );
});

ModalBuyListed.displayName = 'ModalBuyListed';

export default ModalBuyListed;
