import Button from '@components/ButtonIcon';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { validateBTCAddress } from '@utils/validate';
import * as GENERATIVE_SDK from 'generative-sdk';
import { ProfileContext } from '@contexts/profile-context';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import FeeRate from '@containers/Profile/FeeRate';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import { Modal } from 'react-bootstrap';
import BigNumber from 'bignumber.js';
import {
  convertToSatoshiNumber,
  formatBTCOriginalPrice,
  formatBTCPrice,
} from '@utils/format';
import useBitcoin from '@bitcoin/useBitcoin';
import { MINIMUM_SATOSHI } from '@bitcoin/contants';
import Text from '@components/Text';

interface IFormValue {
  address: string;
  amount: string;
}

interface IProps {
  isShow: boolean;
  onHideModal: () => void;
  title: string;
}

const ModalSendBTC = ({ isShow, onHideModal, title }: IProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    collectedUTXOs,
    currentUser,
    debounceFetchCollectedUTXOs,
    debounceFetchHistory,
  } = useContext(ProfileContext);
  const { selectedRate, handleChangeFee, allRate } = useFeeRate();
  const { sendBitcoin, satoshiAmount } = useBitcoin();

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Address is required.';
    } else if (!validateBTCAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else if (
      !!currentUser?.walletAddressBtcTaproot &&
      values.address === currentUser?.walletAddressBtcTaproot
    ) {
      errors.address = "Invalid wallet address, please don't send to yourself.";
    }

    if (!values.amount) {
      errors.amount = 'Amount is required.';
    } else {
      const _amount = new BigNumber(values.amount);
      if (_amount.isNaN()) {
        errors.amount = 'Invalid amount.';
      } else if (convertToSatoshiNumber(_amount.toNumber()) < MINIMUM_SATOSHI) {
        errors.amount = `The minimum sending amount is ${formatBTCOriginalPrice(
          MINIMUM_SATOSHI
        )} BTC.`;
      } else {
        try {
          GENERATIVE_SDK.selectUTXOs(
            collectedUTXOs?.txrefs || [],
            collectedUTXOs?.inscriptions_by_outputs || {},
            '',
            convertToSatoshiNumber(values.amount),
            allRate[selectedRate],
            true
          );
        } catch (e) {
          errors.amount = 'Your BTC balance is insufficient.';
        }
      }
    }
    return errors;
  };

  const handleSubmit = async (_data: IFormValue) => {
    try {
      setIsLoading(true);
      await sendBitcoin({
        receiverAddress: _data.address,
        feeRate: allRate[selectedRate],
        amount: convertToSatoshiNumber(_data.amount),
      });
      toast.success('Transferred successfully');
      debounceFetchCollectedUTXOs();
      debounceFetchHistory();
      onHideModal();
    } catch (err: unknown) {
      // handle error
      toast.error(ErrorMessage.DEFAULT);
      onHideModal();
    } finally {
      setIsLoading(false);
    }
  };

  const _onHideModal = () => {
    setIsLoading(false);
    onHideModal();
  };

  return (
    <Modal className={s.modalWrapper} centered show={isShow}>
      <Modal.Header className={s.modalHeader}>
        <Button
          onClick={onHideModal}
          className={s.modalHeader_closeBtn}
          variants="ghost"
        >
          <SvgInset
            className={s.closeIcon}
            svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
          />
        </Button>
        <Text className={s.modalHeader_title} size="20">
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Formik
          key="SendBTCForm"
          initialValues={{
            address: '',
            amount: '',
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
                  {errors.address && touched.address && (
                    <p className={s.inputError}>{errors.address}</p>
                  )}
                </div>
                <div className={s.formItem}>
                  <div className={s.row}>
                    <label className={s.label} htmlFor="amount">
                      Amount
                    </label>
                    <label className={s.label} htmlFor="amount">
                      Balance: {formatBTCPrice(satoshiAmount.toString())} BTC
                    </label>
                  </div>
                  <div className={s.inputContainer}>
                    <input
                      id="amount"
                      type="number"
                      name="amount"
                      min="0"
                      step="0.00000001"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      className={s.input}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && touched.amount && (
                    <p className={s.inputError}>{errors.amount}</p>
                  )}
                </div>
              </div>
              <FeeRate
                handleChangeFee={handleChangeFee}
                selectedRate={selectedRate}
                allRate={allRate}
              />
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
      </Modal.Body>
    </Modal>
  );
};

export default ModalSendBTC;
