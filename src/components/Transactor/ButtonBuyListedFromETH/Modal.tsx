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
import { formatBTCOriginalPrice } from '@utils/format';
import {
  estimateETH2BTC,
  getGenDepositAddressETH,
  submitSwapETH,
} from '@services/bitcoin';
import {
  IEstimateThorResp,
  IRespGenAddressByETH,
} from '@interfaces/api/bitcoin';
import toast, { LoaderIcon } from 'react-hot-toast';
import { getError } from '@utils/text';
import Text from '@components/Text';
import { Loading } from '@components/Loading';
import useThorSwap from '@bitcoin/useThorSwap';
import { debounce } from 'lodash';
import { sleep } from '@utils/sleep';
import { formatUnixDateTime } from '@utils/time';
import useContractOperation from '@hooks/useContractOperation';
import CreateSwapOperation from '@services/contract-operations/thor/create-transaction';
import { NETWORK_CHAIN_ID } from '@constants/config';

interface IFormValues {
  price: string;
  receiveBTCAddress: string;
}

const TEMP_ADDRESS = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
let COUNTER_STEP = 0.01;

interface IProps extends IBaseModalProps {
  inscriptionID: string;
  price: number | string;
  orderID: string;
  inscriptionNumber: number;
  isDetail: boolean;
}

const ModalBuyListed = React.memo(
  ({ price, orderID, isDetail, ...rest }: IProps) => {
    const user = useSelector(getUserSelector);
    const [step, _] = useState<'buy' | 'success'>('buy');

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { state } = useThorSwap({ priceBTCNano: price });

    const [receiveAddress, setReceiveAddress] = useState<string>(
      user?.walletAddressBtcTaproot || ''
    );

    const [depositData, setDepositData] = useState<
      IRespGenAddressByETH | undefined
    >(undefined);

    const [estimateData, setEstimateData] = useState<
      IEstimateThorResp | undefined
    >(undefined);

    const [sellAmount, setSellAmount] = useState<number | undefined>(undefined);

    const { call: createSwapTx } = useContractOperation(
      CreateSwapOperation,
      false
    );

    const _loading = isLoading || !state.networkFee;

    const [error, setError] = useState('');
    const onSetError = (err: unknown) => {
      const _err = getError(err);
      setError(_err.message);
      // toast.error(_err.message);
    };

    const validateForm = (values: IFormValues) => {
      const errors: Record<string, string> = {};
      if (!values.receiveBTCAddress) {
        errors.receiveBTCAddress = 'Address is required.';
      } else if (!validateBTCAddress(values.receiveBTCAddress)) {
        errors.receiveAddress = 'Invalid wallet address.';
      }

      setReceiveAddress(values.receiveBTCAddress || '');
      return errors;
    };

    const handleSubmit = async (_: IFormValues) => {
      try {
        if (
          !sellAmount ||
          !depositData ||
          !estimateData
          //   || !estimateData?.memo
          //   .toLowerCase()
          //   .includes(values.receiveBTCAddress.toLowerCase())
        ) {
          throw new Error('Estimate fail.');
        }
        setIsSubmitting(true);

        const _sendAmount = new BigNumber(sellAmount)
          .div(1e8)
          .multipliedBy(1e18);
        const tx = await createSwapTx({
          chainID: NETWORK_CHAIN_ID,
          amount: _sendAmount,
          expiry: estimateData.expiry,
          inbound_address: estimateData.inbound_address,
          memo: estimateData.memo,
          router: estimateData.router,
        });
        if (!!tx && !!tx.transactionHash) {
          toast.success('Bought inscription successfully');
          await submitSwapETH({
            order_id: depositData?.order_id,
            txhash: tx.transactionHash,
          });
          setTimeout(() => {
            setIsSubmitting(false);
            window.location.reload();
            setError('');
          }, 2000);
        } else {
          toast.error('Bought inscription failed');
          throw new Error('Bought inscription failed');
        }
      } catch (err: unknown) {
        setIsSubmitting(false);
        onSetError(err);
      }
    };

    const getSellAmount = (sellAmount: string | number, counter: number) => {
      return Math.floor(
        new BigNumber(sellAmount).multipliedBy(counter).toNumber()
      );
    };

    const estimateSellAmount = async (
      receive: string,
      ethHumanAmount: string,
      networkFee: number,
      sellOrderID: string
    ) => {
      if (!receive || !validateBTCAddress(receive)) {
        setDepositData(undefined);
        setEstimateData(undefined);
        setSellAmount(0);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const sellAmount = Math.floor(
          new BigNumber(ethHumanAmount).multipliedBy(1e8).toNumber()
        );
        let estimateData = await estimateETH2BTC({
          sellAmount: sellAmount,
          receiver: TEMP_ADDRESS,
        });
        if (estimateData.error) throw new Error(estimateData.error);
        let receiveAmount = estimateData?.expected_amount_out;
        const expectedAmount = new BigNumber(price).plus(networkFee).toNumber();
        let counter = 1;
        while (new BigNumber(receiveAmount).lte(expectedAmount)) {
          counter += COUNTER_STEP;
          const _sellAmount = getSellAmount(sellAmount, counter);
          estimateData = await estimateETH2BTC({
            sellAmount: _sellAmount,
            receiver: TEMP_ADDRESS,
          });
          if (estimateData.error) throw new Error(estimateData.error);
          receiveAmount = estimateData.expected_amount_out;
          await sleep(1);
        }

        const _sellAmount = getSellAmount(sellAmount, counter);
        const depositData = await getGenDepositAddressETH({
          amount: new BigNumber(estimateData.expected_amount_out).toNumber(),
          fee_rate: 15,
          order_id: sellOrderID,
          receive_address: receiveAddress,
        });
        // const depositData: IRespGenAddressByETH = {
        //   temp_address: TEMP_ADDRESS,
        //   order_id: '1234',
        // };

        estimateData = await estimateETH2BTC({
          sellAmount: _sellAmount,
          receiver: depositData.temp_address,
        });
        if (estimateData.error) throw new Error(estimateData.error);

        setDepositData(depositData);
        setEstimateData(estimateData);
        setSellAmount(_sellAmount);
      } catch (err) {
        onSetError(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceEstimateSellAmount = React.useCallback(
      debounce(estimateSellAmount, 500),
      []
    );

    React.useEffect(() => {
      if (price < 2000000) {
        COUNTER_STEP = 0.07;
      } else {
        COUNTER_STEP = 0.01;
      }
      debounceEstimateSellAmount(
        receiveAddress,
        state.ethHumanAmount,
        state.networkFee,
        orderID
      );
    }, [state, receiveAddress, orderID]);

    return (
      <BaseModal {...rest}>
        <div className={s.container}>
          <Formik
            key="buyListedForm"
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
                      <div className={s.wrapItem_rowBetween}>
                        <label className={s.wrapItem_label} htmlFor="amount">
                          Price
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
                          value={formatBTCOriginalPrice(sellAmount || 0)}
                          className={s.inputContainer_input}
                          placeholder="0.00"
                        />
                        <div className={s.inputContainer_inputPostfix}>ETH</div>
                      </div>
                      {!!error && (
                        <p className={s.inputContainer_inputError}>{error}</p>
                      )}
                    </div>
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
                    {!!estimateData && !!estimateData.expiry && (
                      <>
                        <div
                          className={s.wrapFee_feeRow}
                          style={{ marginTop: 16 }}
                        >
                          <Text
                            size="16"
                            fontWeight="medium"
                            className={s.wrapFee_leftLabel}
                          >
                            Estimate time
                          </Text>
                          <Text
                            size="16"
                            fontWeight="medium"
                            color="text-secondary-color"
                          >
                            ~44 mins
                          </Text>
                        </div>
                        <div
                          className={s.wrapFee_feeRow}
                          style={{ marginTop: 16 }}
                        >
                          <Text
                            size="16"
                            fontWeight="medium"
                            className={s.wrapFee_leftLabel}
                          >
                            Expired at
                          </Text>
                          <Text
                            size="16"
                            fontWeight="medium"
                            color="text-secondary-color"
                          >
                            {formatUnixDateTime({
                              dateTime: estimateData?.expiry,
                            })}
                          </Text>
                        </div>
                      </>
                    )}
                    <div>
                      <Loading isLoaded={!isSubmitting} />
                    </div>
                    {isDetail ? (
                      <ButtonIcon
                        className={s.btnSend}
                        disabled={_loading}
                        sizes="medium"
                        type="submit"
                        startIcon={isLoading ? <LoaderIcon /> : null}
                      >
                        Buy now
                      </ButtonIcon>
                    ) : (
                      <ButtonIcon
                        className={s.btnSend}
                        disabled={_loading}
                        sizes="medium"
                        type="submit"
                        startIcon={_loading ? <LoaderIcon /> : null}
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

ModalBuyListed.displayName = 'ModalBuyListedETH';

export default ModalBuyListed;
