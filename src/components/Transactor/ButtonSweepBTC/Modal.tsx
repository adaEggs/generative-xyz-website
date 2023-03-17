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
import toast, { LoaderIcon } from 'react-hot-toast';
import Text from '@components/Text';
import * as SDK from 'generative-sdk';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import isEmpty from 'lodash/isEmpty';
import FeeRate, { IRef } from '@containers/Profile/FeeRate';

interface IFormValues {
  price: string;
  address: string;
}

interface IProps extends IBaseModalProps {
  isDetail: boolean;
  tokens: Token[];
}

const ModalSweepBTC = React.memo(({ tokens, ...rest }: IProps) => {
  const user = useSelector(getUserSelector);
  const { satoshiAmount: balance, buyMulInscription } = useBitcoin();
  const [error, setError] = useState('');
  const [ordersData, setOrdersData] = React.useState<
    IRetrieveOrdersResp | undefined
  >(undefined);
  const [isLoading, setLoading] = useState<boolean>(false);
  const feeRef = React.useRef<IRef>({
    getCurrentFee: () => '0',
  });

  const onSetError = (err: unknown) => {
    const _err = getError(err);
    setError(_err.message);
  };

  const {
    currentRate,
    selectedRate,
    handleChangeFee,
    allRate,
    customRate,
    handleChangeCustomRate,
  } = useFeeRate();

  const buyableTokens = React.useMemo(() => {
    if (!ordersData || !isEmpty(ordersData.raw_psbt_list_not_avail)) {
      return tokens;
    }
    return tokens.filter(token => {
      const orderID = token.orderID;
      return ordersData.raw_psbt_list[orderID];
    });
  }, [tokens, ordersData]);

  const amount = React.useMemo(() => {
    // one for dummy utxo, one for network fee
    let numIns = 2 + buyableTokens.length;
    // one for new dummy utxo, one for change value
    let numOuts = 2 + buyableTokens.length;
    buyableTokens.forEach(_ => {
      numIns += 2;
      numOuts += 2;
    });

    const input = SDK.estimateTxFee(numIns, numOuts, currentRate);
    const split = SDK.estimateTxFee(
      numIns,
      buyableTokens.length + 2,
      currentRate
    );
    const fee = new BigNumber(input).plus(split).toString();
    const amountOrigin = buyableTokens
      .reduce(
        (partialSum, item) => partialSum.plus(item.priceBTC),
        new BigNumber(0)
      )
      .toString();
    return {
      fee,
      feeStr: formatBTCPrice(fee),

      amountOrigin,
    };
  }, [buyableTokens]);

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
    return errors;
  };

  const handleSubmit = async (values: IFormValues) => {
    try {
      setLoading(true);
      const buyInfos: SDK.BuyReqInfo[] = buyableTokens.map(token => {
        return {
          sellerSignedPsbtB64: ordersData?.raw_psbt_list[token.orderID] || '',
          receiverInscriptionAddress: values.address,
          price: new BigNumber(token.priceBTC),
        };
      });

      await buyMulInscription({
        buyInfos: buyInfos,
        feeRate: currentRate,
        price: new BigNumber(amount.amountOrigin).toNumber(),
        receiver: values.address,
      });
      toast.success('Bought inscriptions successfully');
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
        setError('');
      }, 2000);
    } catch (e) {
      setLoading(false);
      onSetError(e);
    }
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

  const totalAmount = React.useMemo(() => {
    if (feeRef && feeRef.current) {
      const fee = feeRef.current.getCurrentFee() || '0';
      return new BigNumber(amount.amountOrigin)
        .plus(new BigNumber(fee).multipliedBy(1e8))
        .toString();
    }
    return '0';
  }, [amount.amountOrigin, feeRef, currentRate, isLoading]);

  React.useEffect(() => {
    fetchRetrieves().then().catch();
  }, []);

  return (
    <BaseModal {...rest} className={s.modal}>
      <div className={s.container}>
        <Formik
          key="buyListedForm"
          initialValues={{
            price: `${amount.amountOrigin}` || '',
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
                      value={formatBTCPrice(amount.amountOrigin)}
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
                <div className={s.wrapInfo_feeRow} style={{ marginTop: 16 }}>
                  <Text
                    size="16"
                    fontWeight="medium"
                    className={s.wrapInfo_leftLabel}
                  >
                    Quantity
                  </Text>
                  <Text
                    size="16"
                    fontWeight="medium"
                    color="text-secondary-color"
                  >
                    {buyableTokens.length} items
                  </Text>
                </div>
                <FeeRate
                  handleChangeFee={handleChangeFee}
                  selectedRate={selectedRate}
                  allRate={allRate}
                  useCustomRate={true}
                  handleChangeCustomRate={handleChangeCustomRate}
                  customRate={customRate}
                  feeType="buyBTCSweep"
                  ref={feeRef}
                  options={{
                    tokens: buyableTokens,
                  }}
                />
                <div className={s.wrapInfo_divider} />
                <div className={s.wrapInfo_feeRow}>
                  <p className={s.wrapInfo_total}>Total</p>
                  <p className={s.wrapInfo_total}>{`${formatBTCPrice(
                    totalAmount || 0
                  )} BTC`}</p>
                </div>
                <AccordionComponent
                  header="Advanced"
                  content={
                    <div className={s.advancedContent}>
                      <div className={s.wrapItem}>
                        <label className={s.wrapItem_label} htmlFor="address">
                          Enter your Ordinals-compatible BTC address to receive
                          inscription
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
});

ModalSweepBTC.displayName = 'ModalSweepBTC';

export default ModalSweepBTC;
