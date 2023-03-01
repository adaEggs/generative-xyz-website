import React, { useContext, useState } from 'react';
import DropFile from './DropFile';
import s from './styles.module.scss';
import { Formik } from 'formik';
import { validateBTCAddressTaproot } from '@utils/validate';
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
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import RequestConnectWallet from '@containers/RequestConnectWallet';

const LOG_PREFIX = 'Inscribe';

interface IFormValue {
  address: string;
}

const Inscribe: React.FC = (): React.ReactElement => {
  const user = useSelector(getUserSelector);
  const walletCtx = useContext(WalletContext);
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [inscriptionInfo, setInscriptionInfo] =
    useState<InscriptionInfo | null>();
  const [isMinting, setIsMinting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [feeRate, setFeeRate] = useState<InscribeMintFeeRate>(
    InscribeMintFeeRate.FASTEST
  );
  const [isProcessing, setIsProcessing] = useState(false);

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
    } else if (!validateBTCAddressTaproot(values.address)) {
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

  const handleCopy = (): void => {
    if (!inscriptionInfo) return;
    navigator.clipboard.writeText(inscriptionInfo.segwitAddress);
    toast.remove();
    toast.success('Copied');
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsProcessing(true);
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsProcessing(false);
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

  if (!user) {
    return (
      <RequestConnectWallet
        isProcessing={isProcessing}
        handleConnectWallet={handleConnectWallet}
      />
    );
  }

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
                          <div className={s.dropZoneWrapper}>
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
                                      InscribeMintFeeRate.ECONOMY
                                    );
                                    setTimeout(handleSubmit, 0);
                                  }}
                                  className={cs(s.mintFeeItem, {
                                    [`${s.mintFeeItem__active}`]:
                                      feeRate === InscribeMintFeeRate.ECONOMY,
                                  })}
                                >
                                  <p className={s.feeTitle}>Economy</p>
                                  <p
                                    className={s.feeDetail}
                                  >{`${InscribeMintFeeRate.ECONOMY} sats/vByte`}</p>
                                  <p className={s.feeTotal}>
                                    {`${formatBTCPrice(
                                      calculateMintFee(
                                        InscribeMintFeeRate.ECONOMY,
                                        file?.size || 0
                                      )
                                    )} BTC`}
                                  </p>
                                </div>
                                <div
                                  onClick={() => {
                                    handleChangeFee(InscribeMintFeeRate.FASTER);
                                    setTimeout(handleSubmit, 0);
                                  }}
                                  className={cs(s.mintFeeItem, {
                                    [`${s.mintFeeItem__active}`]:
                                      feeRate === InscribeMintFeeRate.FASTER,
                                  })}
                                >
                                  <p className={s.feeTitle}>Faster</p>
                                  <p
                                    className={s.feeDetail}
                                  >{`${InscribeMintFeeRate.FASTER} sats/vByte`}</p>
                                  <p className={s.feeTotal}>
                                    {`${formatBTCPrice(
                                      calculateMintFee(
                                        InscribeMintFeeRate.FASTER,
                                        file?.size || 0
                                      )
                                    )} BTC`}
                                  </p>
                                </div>
                                <div
                                  onClick={() => {
                                    handleChangeFee(
                                      InscribeMintFeeRate.FASTEST
                                    );
                                    setTimeout(handleSubmit, 0);
                                  }}
                                  className={cs(s.mintFeeItem, {
                                    [`${s.mintFeeItem__active}`]:
                                      feeRate === InscribeMintFeeRate.FASTEST,
                                  })}
                                >
                                  <p className={s.feeTitle}>Fastest</p>
                                  <p
                                    className={s.feeDetail}
                                  >{`${InscribeMintFeeRate.FASTEST} sats/vByte`}</p>
                                  <p className={s.feeTotal}>
                                    {`${formatBTCPrice(
                                      calculateMintFee(
                                        InscribeMintFeeRate.FASTEST,
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
                            <Button
                              className={s.submitBtn}
                              disabled={isMinting}
                              type="submit"
                            >
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
