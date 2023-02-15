import React, { useState } from 'react';
import DropFile from './DropFile';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { validateBTCWalletAddress } from '@utils/validate';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import Button from '@components/ButtonIcon';
import { formatBTCPrice } from '@utils/format';
import { generateReceiverAddress } from '@services/inscribe';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import useAsyncEffect from 'use-async-effect';
import { fileToBase64 } from '@utils/file';
import { InscribeMintFeeRate } from '@enums/inscribe';
import { calculateMintFee } from '@utils/inscribe';
import cs from 'classnames';
import { InscriptionInfo } from '@interfaces/inscribe';
import { formatUnixDateTime } from '@utils/time';
import ThankModal from '@containers/Inscribe/Modal';
import ClientOnly from '@components/Utils/ClientOnly';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import BigNumber from 'bignumber.js';

const LOG_PREFIX = 'Inscribe';

interface IFormValue {
  address: string;
}

const Inscribe: React.FC = (): React.ReactElement => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
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
        fileName: file?.name || '',
        file: fileBase64,
        fee_rate: feeRate,
      });
      setInscriptionInfo(res);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
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

  const handleCopy = (): void => {
    if (!inscriptionInfo) return;
    navigator.clipboard.writeText(inscriptionInfo.segwitAddress);
    toast.remove();
    toast.success('Copied');
  };

  return (
    <ClientOnly>
      <div className={s.mintTool}>
        <div className={s.container}>
          <div className={s.wrapper}>
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
                    <div className={s.formContent}>
                      <div className={s.formLeft}>
                        <div className={s.formItem}>
                          <DropFile
                            className={s.dropZoneContainer}
                            onChange={handleChangeFile}
                            fileOrFiles={file ? [file] : null}
                          />
                          {fileError && (
                            <p className={s.inputError}>{fileError}</p>
                          )}
                        </div>
                      </div>
                      <div className={s.formRight}>
                        <div className={s.formItem}>
                          <label className={s.label} htmlFor="address">
                            Where do we send the inscription to?
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
                              placeholder="Paste your Ordinals-compatible address here"
                            />
                          </div>
                          {errors.address && touched.address && (
                            <p className={s.inputError}>{errors.address}</p>
                          )}
                        </div>
                        {fileBase64 && (
                          <>
                            <div className={s.formItem}>
                              <label
                                className={s.labelNoBottom}
                                htmlFor="price"
                              >
                                How fast do you want to get it?
                              </label>
                              <p className={s.upload_sub_title}>
                                It’s free to inscribe with Generative. You pay
                                only the network fees.
                              </p>
                              <div className={s.mintFeeWrapper}>
                                <div
                                  onClick={() => {
                                    handleChangeFee(
                                      InscribeMintFeeRate.Economy
                                    );
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
                                  <p className={s.feeTotal}>
                                    {`${formatBTCPrice(
                                      calculateMintFee(
                                        InscribeMintFeeRate.Economy,
                                        file?.size || 0
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
                                    handleChangeFee(
                                      InscribeMintFeeRate.Fastest
                                    );
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
                                  <p className={s.feeTotal}>
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
                          </>
                        )}
                        {isMinting && (
                          <div className={s.loadingWrapper}>
                            <Loading isLoaded={false} />
                          </div>
                        )}
                        {inscriptionInfo && !isMinting && (
                          <div className={s.qrCodeContainer}>
                            <p className={s.qrTitle}>Payment</p>
                            <div className={s.qrCodeWrapper}>
                              <QRCodeGenerator
                                className={s.qrCodeGenerator}
                                size={128}
                                value={inscriptionInfo.segwitAddress}
                              />
                              <div className={s.qrCodeContentWrapper}>
                                <p className={s.btcSent}>
                                  Send{' '}
                                  <span>
                                    {formatBTCPrice(
                                      new BigNumber(
                                        inscriptionInfo?.amount || 0
                                      ).toNumber()
                                    )}
                                  </span>{' '}
                                  BTC to this address
                                </p>
                                <p className={s.btcAddress}>
                                  {inscriptionInfo.segwitAddress}
                                  <div
                                    className={s.btnCopy}
                                    onClick={handleCopy}
                                  >
                                    Copy
                                  </div>
                                </p>
                                <p className={s.expiredAt}>
                                  Expires at:{' '}
                                  <b>
                                    {formatUnixDateTime({
                                      dateTime: Number(
                                        inscriptionInfo.timeout_at
                                      ),
                                    })}
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className={s.actionWrapper}>
                          {inscriptionInfo?.segwitAddress ? (
                            <div className={s.end}>
                              That’s it. Check your wallet in about an hour.
                            </div>
                          ) : (
                            <Button disabled={isMinting} type="submit">
                              Inscribe
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <ThankModal showModal={show} onClose={() => setShow(false)} />
      </div>
    </ClientOnly>
  );
};

export default Inscribe;
