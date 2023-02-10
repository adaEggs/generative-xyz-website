import React, { useState } from 'react';
import DropFile from './DropFile';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { validateBTCWalletAddress } from '@utils/validate';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import Button from '@components/ButtonIcon';
import { formatBTCPrice } from '@utils/format';
import _debounce from 'lodash/debounce';
import { generateBTCReceiverAddressV2 } from '@services/btc';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import useAsyncEffect from 'use-async-effect';
import { fileToBase64 } from '@utils/file';

const LOG_PREFIX = 'MintTool';

interface IFormValue {
  address: string;
  name: string;
}

const MintTool: React.FC = (): React.ReactElement => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>();
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChangeFile = (file: File | null): void => {
    setFile(file);
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!file) {
      setFileError('File is required.');
    } else {
      setFileError(null);
    }

    if (!values.name) {
      errors.name = `NFT's name is required.`;
    }

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCWalletAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (!fileBase64) {
      return;
    }

    try {
      const { address, name } = values;
      setIsMinting(true);
      setReceiverAddress(null);
      const { amount, ordAddress } = await generateBTCReceiverAddressV2({
        walletAddress: address,
        name,
        file: fileBase64,
      });

      setReceiverAddress(ordAddress);
      setPrice(amount);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsMinting(false);
    }
  };

  useAsyncEffect(async () => {
    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    if (base64) {
      setFileBase64(base64 as string);
    }
  }, [file]);

  return (
    <div className={s.mintTool}>
      <div className={s.wrapper}>
        <h1 className={s.title}>Inscribe</h1>
        <div className={s.alertInfo}>
          Do not spend any satoshis from this wallet unless you understand what
          you are doing. If you ignore this warning, you could inadvertently
          lose access to your ordinals and inscriptions.
        </div>
        <div className={s.formWrapper}>
          <div className={s.dropFileWrapper}>
            <DropFile
              className={s.dropZoneContainer}
              onChange={handleChangeFile}
              fileOrFiles={file ? [file] : null}
            />
            {fileError && <p className={s.inputError}>{fileError}</p>}
          </div>
          <Formik
            key="mintBTCGenerativeForm"
            initialValues={{
              address: '',
              name: '',
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
                  <label className={s.label} htmlFor="name">
                    NFT Name
                    <sup className={s.requiredTag}>*</sup>
                  </label>
                  <div className={s.inputContainer}>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={s.input}
                      placeholder="Enter NFT's name"
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className={s.inputError}>{errors.name}</p>
                  )}
                </div>
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="address">
                    Transfer NFT to <sup className={s.requiredTag}>*</sup>
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
                      placeholder="Enter your BTC wallet address"
                    />
                  </div>
                  {errors.address && touched.address && (
                    <p className={s.inputError}>{errors.address}</p>
                  )}
                </div>
                {isMinting && (
                  <div className={s.loadingWrapper}>
                    <Loading isLoaded={false}></Loading>
                  </div>
                )}
                {receiverAddress && price && !isMinting && (
                  <>
                    <div className={s.formItem}>
                      <label className={s.label} htmlFor="price">
                        Price <sup className={s.requiredTag}>*</sup>
                      </label>
                      <div className={s.inputContainer}>
                        <input
                          disabled
                          id="price"
                          type="number"
                          value={formatBTCPrice(Number(price))}
                          className={s.input}
                        />
                        <div className={s.inputPostfix}>BTC</div>
                      </div>
                    </div>
                    <div className={s.qrCodeWrapper}>
                      <p className={s.qrTitle}>
                        Send BTC to this deposit address
                      </p>
                      <QRCodeGenerator
                        className={s.qrCodeGenerator}
                        size={128}
                        value={receiverAddress}
                      />
                      <p className={s.btcAddress}>{receiverAddress}</p>
                    </div>
                  </>
                )}
                <div className={s.actionWrapper}>
                  <Button disabled={isMinting} type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default MintTool;
