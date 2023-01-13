import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeTokenDetailContext } from '@contexts/generative-token-detail-context';
import cs from 'classnames';
import React, { useContext, useState } from 'react';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { WalletContext } from '@contexts/wallet-context';

enum SwapWay {
  ETH_WETH = 'ETH_WETH',
  WETH_ETH = 'WETH_ETH',
}

interface IFormValues {
  fromToken: number;
  toToken: number;
}

const SwapTokenModal: React.FC = (): React.ReactElement => {
  const { showSwapTokenModal, hideSwapTokenModal } = useContext(
    GenerativeTokenDetailContext
  );
  const { walletBalance } = useContext(WalletContext);
  const [isProcessing] = useState(false);
  const [swapWay] = useState<SwapWay>(SwapWay.ETH_WETH);

  const handleClose = (): void => {
    hideSwapTokenModal();
  };

  const validateForm = (values: IFormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.fromToken.toString()) {
      errors.fromToken = 'Value is required.';
    } else if (values.fromToken < 0) {
      errors.fromToken = 'Invalid number. Must be greater than 0.';
    }

    if (!values.toToken.toString()) {
      errors.toToken = 'Value is required.';
    } else if (values.fromToken < 0) {
      errors.toToken = 'Invalid number. Must be greater than 0.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    //
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
                    fromToken: 0,
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
                          <label className={s.label} htmlFor="fromToken">
                            Swap <sup className={s.requiredTag}>*</sup>
                          </label>
                          <div className={s.inputContainer}>
                            <input
                              id="fromToken"
                              type="number"
                              name="fromToken"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.fromToken}
                              className={s.input}
                              placeholder="0"
                            />
                            <div className={s.inputPostfix}>
                              {swapWay === SwapWay.ETH_WETH ? 'ETH' : 'WETH'}
                            </div>
                          </div>
                          {errors.fromToken && touched.fromToken && (
                            <p className={s.error}>{errors.fromToken}</p>
                          )}
                          {swapWay === SwapWay.ETH_WETH && (
                            <p className={s.inputDesc}>
                              Balance: {walletBalance.toFixed(4)}
                            </p>
                          )}
                        </div>
                        <div className={s.swapActionWrapper}></div>
                        <div className={s.formItem}>
                          <label className={s.label} htmlFor="toToken">
                            For <sup className={s.requiredTag}>*</sup>
                          </label>
                          <div className={s.inputContainer}>
                            <input
                              id="toToken"
                              type="number"
                              name="toToken"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.toToken}
                              className={s.input}
                              placeholder="0"
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
                          Confirm
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
