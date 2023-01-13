import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeTokenDetailContext } from '@contexts/generative-token-detail-context';
import cs from 'classnames';
import React, { useContext, useState } from 'react';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { WalletContext } from '@contexts/wallet-context';
import { toast } from 'react-hot-toast';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

const LOG_PREFIX = 'SwapTokenModal';

enum SwapWay {
  ETH_WETH = 'ETH_WETH',
  WETH_ETH = 'WETH_ETH',
}

interface IFormValues {
  amount: number;
}

const SwapTokenModal: React.FC = (): React.ReactElement => {
  const { showSwapTokenModal, hideSwapTokenModal, handleDepositToken } =
    useContext(GenerativeTokenDetailContext);
  const { walletBalance } = useContext(WalletContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [swapWay] = useState<SwapWay>(SwapWay.ETH_WETH);

  const handleClose = (): void => {
    hideSwapTokenModal();
  };

  const validateForm = (values: IFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.amount.toString()) {
      errors.amount = 'Value is required.';
    } else if (values.amount < 0) {
      errors.amount = 'Invalid number. Must be greater than 0.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValues): Promise<void> => {
    try {
      setIsProcessing(true);
      await handleDepositToken(values.amount.toString());
    } catch (err: unknown) {
      toast.error((err as Error).message);
      log('failed to swap token', LogLevel.Error, LOG_PREFIX);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!showSwapTokenModal) {
    return <></>;
  }

  return (
    <div className={cs(s.swapTokenModal)}>
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
                  size={28}
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              <h3 className={s.modalTitle}>Add fund</h3>
              <p className={s.modalDescription}>Swap for WETH</p>
              <div className={s.formWrapper}>
                <Formik
                  key="swapTokenForm"
                  initialValues={{
                    amount: 0,
                    toToken: 0,
                  }}
                  validate={validateForm}
                  onSubmit={handleSubmit}
                  validateOnChange
                  enableReinitialize
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
                      <div className={cs(s.swapTokenWrapper)}>
                        <div className={s.formItem}>
                          <label className={s.label} htmlFor="amount">
                            Swap <sup className={s.requiredTag}>*</sup>
                          </label>
                          <div className={s.inputContainer}>
                            <input
                              id="amount"
                              type="number"
                              name="amount"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.amount}
                              className={s.input}
                              placeholder="0"
                            />
                            <div className={s.inputPostfix}>
                              {swapWay === SwapWay.ETH_WETH ? 'ETH' : 'WETH'}
                            </div>
                          </div>
                          {errors.amount && touched.amount && (
                            <p className={s.error}>{errors.amount}</p>
                          )}
                          {swapWay === SwapWay.ETH_WETH && (
                            <p className={s.inputDesc}>
                              Balance: {walletBalance.toFixed(4)}
                            </p>
                          )}
                        </div>
                        <div className={s.swapActionWrapper}></div>
                        <div className={s.formItem}>
                          <label className={s.label}>
                            For <sup className={s.requiredTag}>*</sup>
                          </label>
                          <div className={s.inputContainer}>
                            <input
                              type="number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.amount}
                              className={s.input}
                              placeholder="0"
                              disabled
                            />
                            <div className={s.inputPostfix}>
                              {swapWay === SwapWay.ETH_WETH ? 'WETH' : 'ETH'}
                            </div>
                          </div>
                          {errors.toToken && touched.toToken && (
                            <p className={s.error}>{errors.toToken}</p>
                          )}
                          {swapWay === SwapWay.WETH_ETH && (
                            <p className={s.inputDesc}>
                              Balance: {walletBalance.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={s.divider}></div>
                      <div className={s.actionWrapper}>
                        <Button
                          type="submit"
                          disabled={isProcessing}
                          className={s.actionBtn}
                        >
                          {isProcessing ? 'Processing' : 'Confirm'}
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapTokenModal;
