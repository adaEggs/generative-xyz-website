import Button from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import ClientOnly from '@components/Utils/ClientOnly';
import { CDN_URL } from '@constants/config';
import ThankModal from '@containers/Inscribe/Modal';
import { dataURItoBlob } from '@containers/ObjectPreview/GltfPreview/helpers';
import { ErrorMessage } from '@enums/error-message';
import { InscribeMintFeeRate } from '@enums/inscribe';
import { LogLevel } from '@enums/log-level';
import { IGenerateReceiverAddressPayload } from '@interfaces/api/inscribe';
import { InscriptionInfo } from '@interfaces/inscribe';
import { getUserSelector } from '@redux/user/selector';
import { resizeImage } from '@services/file';
import { generateReceiverAddress } from '@services/inscribe';
import { getNFTDetailFromMoralis } from '@services/token-moralis';
import { blobToBase64, blobToFile, fileToBase64 } from '@utils/file';
import { formatBTCPrice, formatLongAddress } from '@utils/format';
import { convertIpfsToHttp, isValidImage } from '@utils/image';
import { calculateMintFee } from '@utils/inscribe';
import log from '@utils/logger';
import { checkForHttpRegex } from '@utils/string';
import { formatUnixDateTime } from '@utils/time';
import { validateBTCAddressTaproot } from '@utils/validate';
import BigNumber from 'bignumber.js';
import cs from 'classnames';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import useAsyncEffect from 'use-async-effect';
import { v4 as uuidv4 } from 'uuid';
import DropFile from './DropFile';
import s from './styles.module.scss';

const LOG_PREFIX = 'Inscribe';

interface IFormValue {
  address: string;
}

interface IProps {
  isModal?: boolean;
  uploadedFile?: File | null;
  setUploadedFile: (file: File | null) => void;
}

const Inscribe: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { isModal = false, uploadedFile, setUploadedFile } = props;
  const user = useSelector(getUserSelector);
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
  const [addressInputDisabled, setAddressInputDisabled] = useState(true);

  const router = useRouter();
  const { isAuthentic, tokenAddress, tokenId } = router.query;

  const addressInputRef = useRef<HTMLInputElement>(null);

  const resetAuthenticQueryParams = (): void => {
    const { pathname, query } = router;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = new URLSearchParams(query as any);
    params.delete('isAuthentic');
    params.delete('tokenAddress');
    params.delete('tokenId');
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  const handleResizeImage = async (imageBlob: Blob): Promise<File | null> => {
    // Check if image larger than 1MB
    if (imageBlob.size > 1024 * 1024) {
      // Call API to get resized base64 string
      try {
        const fileBase64 = await blobToBase64(imageBlob);
        const { file: resizedImageBase64 } = await resizeImage({
          file: fileBase64 as string,
        });
        if (!resizedImageBase64) {
          resetAuthenticQueryParams();
          return null;
        }
        const resizedBlob = dataURItoBlob(resizedImageBase64);
        return blobToFile(
          `${uuidv4()}.${resizedBlob.type.replace('image/', '')}`,
          resizedBlob
        );
      } catch (err: unknown) {
        log('can not resize image', LogLevel.ERROR, LOG_PREFIX);
        resetAuthenticQueryParams();
        return null;
      }
    }
    // If not, convert to File object and return
    else {
      return blobToFile(
        `${uuidv4()}.${imageBlob.type.replace('image/', '')}`,
        imageBlob
      );
    }
  };

  const handleLoadFile = async (): Promise<void> => {
    try {
      if (isAuthentic && tokenAddress && tokenId) {
        const res = await getNFTDetailFromMoralis({
          tokenAddress: tokenAddress as string,
          tokenId: tokenId as string,
        });
        const metadata = JSON.parse(res.metadata);

        if ((metadata.image as string).includes('ipfs')) {
          metadata.image = convertIpfsToHttp(metadata.image);
        }

        // Handle link
        if (checkForHttpRegex(metadata.image)) {
          // Check if url is image
          const isValidUrl = await isValidImage(metadata.image);
          if (isValidUrl) {
            const imageRes = await fetch(metadata.image);
            const imageBlob = await imageRes.blob();
            const resizedImage = await handleResizeImage(imageBlob);
            setFile(resizedImage);
          } else {
            resetAuthenticQueryParams();
          }
        }
        // Handle base64
        else {
          const isValidBase64 = await isValidImage(metadata.image);
          if (isValidBase64) {
            const imageBlob = dataURItoBlob(metadata.image);
            const resizedImage = await handleResizeImage(imageBlob);
            setFile(resizedImage);
          } else {
            resetAuthenticQueryParams();
          }
        }
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const handleChangeFile = (file: File | null): void => {
    setFile(file);
    handleResizeImage(file as Blob);
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
      const payload: IGenerateReceiverAddressPayload = {
        walletAddress: address,
        fileName: file?.name || '',
        file: fileBase64,
        fee_rate: feeRate,
        payType: 'btc',
      };
      if (tokenAddress) {
        payload.tokenAddress = tokenAddress as string;
      }
      if (tokenId) {
        payload.tokenId = tokenId as string;
      }
      const res = await generateReceiverAddress(payload);
      setInscriptionInfo(res);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.remove();
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

  useEffect(() => {
    if (!addressInputDisabled && addressInputRef.current) {
      addressInputRef.current.focus();
    }
  }, [addressInputDisabled]);

  useAsyncEffect(async () => {
    if (!file) {
      return;
    }
    // setFileError(null);
    const base64 = await fileToBase64(file);
    if (base64) {
      setFileBase64(base64 as string);
    }
  }, [file]);

  useEffect(() => {
    if (uploadedFile) {
      handleChangeFile(uploadedFile);
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (router.isReady) {
      handleLoadFile();
    }
  }, [router]);

  return (
    <ClientOnly>
      <div
        className={cs(s.mintTool, {
          [`${s.modal}`]: isModal,
        })}
      >
        <div className={s.container}>
          <div className={s.wrapper}>
            <div className={s.formWrapper}>
              <Formik
                key="mintBTCGenerativeForm"
                initialValues={{
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
                    <div className={s.formContent}>
                      <div className={s.formLeft}>
                        <div className={s.formItem}>
                          <div className={s.dropZoneWrapper}>
                            <DropFile
                              className={s.dropZoneContainer}
                              onChange={handleChangeFile}
                              fileOrFiles={file ? [file] : null}
                              setFileError={setFileError}
                            />
                          </div>
                          <div className={s.formItem}>
                            <label className={s.addressLabel} htmlFor="address">
                              <Text
                                as="span"
                                size="12"
                                color="black-60"
                                fontWeight="medium"
                              >
                                Where do we send the inscription to?
                              </Text>
                            </label>
                            <div
                              className={`${s.inputContainer} ${s.addressInput}`}
                            >
                              <input
                                id="address"
                                type="text"
                                name="address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={addressInputDisabled}
                                value={
                                  addressInputDisabled
                                    ? formatLongAddress(values.address)
                                    : values.address
                                }
                                className={cs(
                                  s.input,
                                  addressInputDisabled && 'text-black-60'
                                )}
                                placeholder="Paste your Ordinals-compatible address here"
                                ref={addressInputRef}
                              />
                              <div
                                className={cs(
                                  s.editAddress,
                                  errors.address &&
                                    touched.address &&
                                    s.disabled
                                )}
                                onClick={() =>
                                  setAddressInputDisabled(!addressInputDisabled)
                                }
                              >
                                {addressInputDisabled ? 'Edit' : 'Save'}
                              </div>
                            </div>
                            {errors.address && touched.address && (
                              <p className={s.inputError}>{errors.address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`${s.formRight}`}>
                        {fileBase64 && (
                          <>
                            <div
                              className={`${s.formItem}  ${
                                fileError ? s.disabled : ''
                              }`}
                            >
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
                                        file?.size || 0,
                                        !!isAuthentic
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
                                        file?.size || 0,
                                        !!isAuthentic
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
                                        file?.size || 0,
                                        !!isAuthentic
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
                        {inscriptionInfo && !isMinting && !fileError && (
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
                                        inscriptionInfo.timeoutAt
                                      ),
                                    })}
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className={s.actionWrapper}>
                          {inscriptionInfo?.segwitAddress && !fileError ? (
                            <div className={s.end}>
                              <SvgInset
                                size={18}
                                svgUrl={`${CDN_URL}/icons/ic-clock.svg`}
                              />
                              <Text size="14" fontWeight="medium">
                                That’s it. Check your wallet in about an hour.
                              </Text>
                            </div>
                          ) : (
                            <>
                              <Button
                                className={s.submitBtn}
                                disabled={isMinting}
                                sizes={'large'}
                                variants="secondary"
                                onClick={() => setUploadedFile(null)}
                              >
                                Back
                              </Button>
                              <Button
                                className={s.submitBtn}
                                disabled={isMinting || !!fileError}
                                type="submit"
                                sizes={'large'}
                              >
                                Inscribe
                              </Button>
                            </>
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
