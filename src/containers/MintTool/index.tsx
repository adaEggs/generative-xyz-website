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
import { generateReceiverAddress } from '@services/inscribe';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import useAsyncEffect from 'use-async-effect';
import { fileToBase64 } from '@utils/file';
import { InscribeMintFeeRate } from '@enums/inscribe';
import { calculateMintFee } from '@utils/inscribe';
import cs from 'classnames';
import { InscriptionInfo } from '@interfaces/inscribe';

const LOG_PREFIX = 'MintTool';

interface IFormValue {
  address: string;
}

const MintTool: React.FC = (): React.ReactElement => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [inscriptionInfo, setInscriptionInfo] =
    useState<InscriptionInfo | null>();
  const [isMinting, setIsMinting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [feeRate, setFeeRate] = useState<InscribeMintFeeRate>(
    InscribeMintFeeRate.Fastest
  );

  const handleChangeFile = (file: File | null): void => {
    setFile(file);
  };

  const handleChangeFee = (fee: InscribeMintFeeRate): void => {
    setFeeRate(fee);
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!fileBase64) {
      setFileError('File is required.');
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
      const { address } = values;
      setIsMinting(true);
      setInscriptionInfo(null);
      const res = await generateReceiverAddress({
        walletAddress: address,
        name: '',
        file: fileBase64,
        fee_rate: feeRate,
      });
      setInscriptionInfo(res);
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

    setFileError(null);
    const base64 = await fileToBase64(file);
    if (base64) {
      setFileBase64(base64 as string);
    }
  }, [file]);

  return (
    <div className={s.mintTool}>
      <div className="container">
        <div className={s.wrapper}>
          <h1 className={s.title}>Inscribe</h1>
          <div className={s.formWrapper}>
            <Formik
              key="mintBTCGenerativeForm"
              initialValues={{
                address: '',
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
                    <DropFile
                      className={s.dropZoneContainer}
                      onChange={handleChangeFile}
                      fileOrFiles={file ? [file] : null}
                    />
                    {fileError && <p className={s.inputError}>{fileError}</p>}
                  </div>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="address">
                      Transfer the inscription (Bitcoin NFT) to{' '}
                      <sup className={s.requiredTag}>*</sup>
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
                        placeholder="Enter your Ordinals-compatible BTC address"
                      />
                    </div>
                    {errors.address && touched.address && (
                      <p className={s.inputError}>{errors.address}</p>
                    )}
                  </div>
                  <div className={s.alertInfo}>
                    Do not spend any satoshis from this wallet unless you
                    understand what you are doing. If you ignore this warning,
                    you could inadvertently lose access to your ordinals and
                    inscriptions.
                  </div>
                  {file && (
                    <>
                      <div className={s.formItem}>
                        <label className={s.label} htmlFor="price">
                          Bitcoin transaction fees{' '}
                          <sup className={s.requiredTag}>*</sup>
                        </label>
                        <div className={s.mintFeeWrapper}>
                          <div
                            onClick={() => {
                              handleChangeFee(InscribeMintFeeRate.Economy);
                              setTimeout(handleSubmit, 0);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === InscribeMintFeeRate.Economy,
                            })}
                          >
                            <p className={s.feeTitle}>Economy</p>
                            <p
                              className={s.feeDetail}
                            >{`${InscribeMintFeeRate.Economy} sats/vByte`}</p>
                            <p className={s.total}>
                              {`${formatBTCPrice(
                                calculateMintFee(
                                  InscribeMintFeeRate.Economy,
                                  file.size || 0
                                )
                              )} BTC`}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              handleChangeFee(InscribeMintFeeRate.Faster);
                              setTimeout(handleSubmit, 0);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === InscribeMintFeeRate.Faster,
                            })}
                          >
                            <p className={s.feeTitle}>Faster</p>
                            <p
                              className={s.feeDetail}
                            >{`${InscribeMintFeeRate.Faster} sats/vByte`}</p>
                            <p className={s.feeTotal}>
                              {`${formatBTCPrice(
                                calculateMintFee(
                                  InscribeMintFeeRate.Faster,
                                  file?.size || 0
                                )
                              )} BTC`}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              handleChangeFee(InscribeMintFeeRate.Fastest);
                              setTimeout(handleSubmit, 0);
                            }}
                            className={cs(s.mintFeeItem, {
                              [`${s.mintFeeItem__active}`]:
                                feeRate === InscribeMintFeeRate.Fastest,
                            })}
                          >
                            <p className={s.feeTitle}>Fastest</p>
                            <p
                              className={s.feeDetail}
                            >{`${InscribeMintFeeRate.Fastest} sats/vByte`}</p>
                            <p className={s.total}>
                              {`${formatBTCPrice(
                                calculateMintFee(
                                  InscribeMintFeeRate.Fastest,
                                  file?.size || 0
                                )
                              )} BTC`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={s.formItem}>
                        <label className={s.label} htmlFor="">
                          Generative fees: <strong>FREE</strong>
                        </label>
                      </div>
                    </>
                  )}
                  {isMinting && (
                    <div className={s.loadingWrapper}>
                      <Loading isLoaded={false}></Loading>
                    </div>
                  )}
                  {inscriptionInfo && !isMinting && (
                    <>
                      <div className={s.qrCodeWrapper}>
                        <p className={s.qrTitle}>
                          Send Bitcoin transaction fees to this address
                        </p>
                        <QRCodeGenerator
                          className={s.qrCodeGenerator}
                          size={128}
                          value={inscriptionInfo.segwitAddress}
                        />
                        <p className={s.btcAddress}>
                          {inscriptionInfo.segwitAddress}
                        </p>
                      </div>
                    </>
                  )}
                  <div className={s.actionWrapper}>
                    <Button disabled={isMinting} type="submit">
                      Inscribe
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintTool;
