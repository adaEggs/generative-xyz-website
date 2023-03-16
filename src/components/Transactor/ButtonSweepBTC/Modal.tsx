import React, { useState } from 'react';
import BaseModal, { IBaseModalProps } from '@components/Transactor';
import s from '@components/Transactor/form.module.scss';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { validateBTCAddressTaproot } from '@utils/validate';
import BigNumber from 'bignumber.js';
import AccordionComponent from '@components/Accordion';
import { formatBTCPrice } from '@utils/format';
import { retrieveOrders } from '@services/bitcoin';
import { IRetrieveOrdersResp } from '@interfaces/api/bitcoin';
import { useBitcoin } from '@bitcoin/index';
import { getError } from '@utils/text';
import { Token } from '@interfaces/token';
import ButtonIcon from '@components/ButtonIcon';
import { LoaderIcon } from 'react-hot-toast';
import Text from '@components/Text';
import * as SDK from 'generative-sdk';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';

interface IFormValues {
  price: string;
  address: string;
}

interface IProps extends IBaseModalProps {
  isDetail: boolean;
  amountOrigin: string;
  tokens: Token[];
}

const ModalSweepBTC = React.memo(
  ({ amountOrigin, tokens, ...rest }: IProps) => {
    const user = useSelector(getUserSelector);
    const { satoshiAmount: balance } = useBitcoin();
    const [error, setError] = useState('');
    const [_, setOrdersData] = React.useState<IRetrieveOrdersResp | undefined>(
      undefined
    );
    const [isLoading, setLoading] = useState<boolean>(false);
    const onSetError = (err: unknown) => {
      const _err = getError(err);
      setError(_err.message);
    };

    const { currentRate } = useFeeRate();

    const amount = React.useMemo(() => {
      // one for dummy utxo, one for network fee
      let numIns = 2 + tokens.length;
      // one for new dummy utxo, one for change value
      let numOuts = 2 + tokens.length;
      tokens.forEach(_ => {
        numIns += 2;
        numOuts += 2;
      });

      const input = SDK.estimateTxFee(numIns, numOuts, currentRate);
      const split = SDK.estimateTxFee(numIns, tokens.length + 2, currentRate);
      const fee = new BigNumber(input).plus(split).toString();
      return {
        fee,
        feeStr: formatBTCPrice(fee),

        amountOrigin,
      };
    }, [tokens, amountOrigin]);

    const validateForm = (values: IFormValues) => {
      const errors: Record<string, string> = {};

      if (!values.price || !new BigNumber(values.price || 0)) {
        errors.price = 'Required.';
      }

      if (!values.address) {
        errors.address = 'Address is required.';
      } else if (!validateBTCAddressTaproot(values.address)) {
        errors.address = 'Invalid wallet address.';
      }

      const isOutBalance = new BigNumber(amount.fee)
        .plus(amount.amountOrigin)
        .gt(balance);

      if (isOutBalance) {
        errors.price =
          SDK.ERROR_MESSAGE[SDK.ERROR_CODE.NOT_ENOUGH_BTC_TO_SEND].message;
      }
      return errors;
    };

    const handleSubmit = async (_: IFormValues) => {
      // TODO
    };

    const fetchRetrieves = async () => {
      try {
        setLoading(true);
        const orders = await retrieveOrders({
          order_list: tokens.map(token => token.orderID),
        });
        setOrdersData(orders);
      } catch (err) {
        onSetError(err);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      fetchRetrieves().then().catch();
    }, []);

    return (
      <BaseModal {...rest}>
        <div className={s.container}>
          <Formik
            key="buyListedForm"
            initialValues={{
              price: `${amountOrigin}` || '',
              address: user?.walletAddressBtcTaproot || '',
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
                <>
                  <div className={s.wrapItem}>
                    <div className={s.wrapItem_rowBetween}>
                      <label className={s.wrapItem_label} htmlFor="amount">
                        Price
                      </label>
                      <label className={s.wrapItem_label} htmlFor="amount">
                        Balance: {formatBTCPrice(balance)} BTC
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
                        value={formatBTCPrice(amountOrigin)}
                        className={s.inputContainer_input}
                        placeholder="0.00"
                      />
                      <div className={s.inputContainer_inputPostfix}>BTC</div>
                    </div>
                    {(!!error || errors.price) && (
                      <p className={s.inputContainer_inputError}>
                        {error || errors.price}
                      </p>
                    )}
                  </div>
                  <div className={s.wrapFee_feeRow} style={{ marginTop: 16 }}>
                    <Text
                      size="16"
                      fontWeight="medium"
                      className={s.wrapFee_leftLabel}
                    >
                      Network fees
                    </Text>
                    <Text
                      size="16"
                      fontWeight="medium"
                      color="text-secondary-color"
                    >
                      {amount.feeStr} BTC
                    </Text>
                  </div>
                  <AccordionComponent
                    header="Advanced"
                    content={
                      <div className={s.advancedContent}>
                        <div className={s.wrapItem}>
                          <label className={s.wrapItem_label} htmlFor="address">
                            Enter your Ordinals-compatible BTC address to
                            receive inscription
                          </label>
                          <div className={s.inputContainer}>
                            <input
                              id="address"
                              type="address"
                              name="address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.address}
                              className={s.inputContainer_input}
                              placeholder="Paste your Ordinals-compatible BTC address here"
                              disabled={isLoading}
                            />
                            {errors.address && touched.address && (
                              <p className={s.inputContainer_inputError}>
                                {errors.address}
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
                    startIcon={isLoading ? <LoaderIcon /> : null}
                  >
                    Buy now
                  </ButtonIcon>
                </>
              </form>
            )}
          </Formik>
        </div>
      </BaseModal>
    );
  }
);

ModalSweepBTC.displayName = 'ModalSweepBTC';

export default ModalSweepBTC;
