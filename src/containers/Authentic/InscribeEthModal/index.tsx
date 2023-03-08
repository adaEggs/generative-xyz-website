import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import QRCodeGenerator from '@components/QRCodeGenerator';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { dataURItoBlob } from '@containers/ObjectPreview/GltfPreview/helpers';
import { WalletContext } from '@contexts/wallet-context';
import { ErrorMessage } from '@enums/error-message';
import { InscribeMintFeeRate } from '@enums/inscribe';
import { LogLevel } from '@enums/log-level';
import { IGenerateReceiverAddressPayload } from '@interfaces/api/inscribe';
import { InscriptionInfo } from '@interfaces/inscribe';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { resizeImage } from '@services/file';
import { generateReceiverAddress } from '@services/inscribe';
import { getNFTDetailFromMoralis } from '@services/token-moralis';
import { blobToBase64, blobToFile, fileToBase64 } from '@utils/file';
import { ellipsisCenter, formatBTCPrice } from '@utils/format';
import { convertIpfsToHttp, isValidImage } from '@utils/image';
import { calculateMintFee } from '@utils/inscribe';
import log from '@utils/logger';
import { checkForHttpRegex } from '@utils/string';
import { validateBTCAddressTaproot } from '@utils/validate';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import useAsyncEffect from 'use-async-effect';
import { v4 as uuidv4 } from 'uuid';
import s from './styles.module.scss';

interface IProps {
  handleClose: () => void;
}

interface IFormValue {
  address: string;
}

const LOG_PREFIX = 'InscribeEthModal';

const InscribeEthModal: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const router = useRouter();
  const { isAuthentic, tokenAddress, tokenId } = router.query;
  const { handleClose } = props;

  // const { projectData } = useContext(GenerativeProjectDetailContext);
  //   const projectData = {};
  const { transfer } = useContext(WalletContext);

  const user = useAppSelector(getUserSelector);

  const [isSent, setIsSent] = useState(false);
  const [totalPrice] = useState('');
  //   const [feePrice, setFeePrice] = useState('');
  //   const [mintPrice, setMintPrice] = useState('');

  const [inscriptionInfo, setInscriptionInfo] =
    useState<InscriptionInfo | null>();
  const [useWallet, setUseWallet] = useState<'default' | 'another'>('default');
  const [isShowAdvance, setIsShowAdvance] = useState(false);
  const [step, setsTep] = useState<'info' | 'showAddress'>('info');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  //   const [fileError, setFileError] = useState<string | null>(null);

  const [isLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState<string>('');
  const [errMessage, setErrMessage] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const [quantity] = useState(1);

  //   const inscribeFee = inscribeFee || 0;
  //   const inscribeFee = '12345678900000000';

  //   const priceFormat = formatEthPrice(
  //     mintPrice ? mintPrice : inscribeFee || '',
  //     '0.0'
  //   );
  //   const totalFormatPrice = formatEthPriceInput(
  //     totalPrice ? totalPrice : inscribeFee || ''
  //   );

  // TODO: Update ETH price
  const totalFormatPrice = formatBTCPrice(
    calculateMintFee(
      InscribeMintFeeRate.ECONOMY,
      file?.size || 0,
      !!isAuthentic
    )
  );

  //   const feePriceFormat = formatEthPrice(
  //     `${feePrice ? Number(feePrice) : Number(inscribeFee)}`,
  //     '0.0'
  //   );

  //   const onChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setQuantity(Number(e.target.value));
  //   };

  //   const onClickMinus = () => {
  //     if (quantity > 1) {
  //       setQuantity(quantity - 1);
  //     }
  //   };

  //   const onClickPlus = () => {
  //     setQuantity(quantity + 1);
  //   };

  const userAddress = React.useMemo(() => {
    return {
      taproot: user?.walletAddressBtcTaproot || '',
      evm: user?.walletAddress || '',
    };
  }, [user]);

  const handleTransfer = async (
    toAddress: string,
    val: string
  ): Promise<void> => {
    try {
      setIsSent(false);
      await transfer(toAddress, val);
      setIsSent(true);
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
      _onClose();
    }
  };

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

  useEffect(() => {
    if (receiverAddress) {
      handleTransfer(receiverAddress, totalFormatPrice);
    }
  }, [receiverAddress, totalPrice]);

  useEffect(() => {
    if (router.isReady) {
      handleLoadFile();
    }
  }, [router]);

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

  //   const debounceGetBTCAddress = useCallback(
  //     _debounce(async (ordAddress, refundAddress, _quantity) => {
  //       if (!projectData) return;
  //       try {
  //         setIsLoading(true);

  //         const {
  //           price: _price,
  //           address: _address,
  //           networkFeeByPayType: _networkFeeByPayType,
  //           mintPriceByPayType: _mintPriceByPayType,
  //         } = await getBTCAddress({
  //           walletAddress: ordAddress,
  //           refundAddress: refundAddress,
  //           projectData,
  //           paymentMethod: PaymentMethod.ETH,
  //           quantity: _quantity,
  //         });
  //         if (!_address || !_price) {
  //           toast.error(ErrorMessage.DEFAULT);
  //           return;
  //         }

  //         setTotalPrice(_price);
  //         setFeePrice(_networkFeeByPayType);
  //         setMintPrice(_mintPriceByPayType);
  //         setReceiverAddress(_address);
  //         setsTep('showAddress');
  //       } catch (err: unknown) {
  //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //         // @ts-ignore
  //         setErrMessage('Failed to generate receiver address');
  //         setReceiverAddress(null);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }, 500),
  //     [projectData]
  //   );

  const onClickCopy = (text: string) => {
    copy(text);
    toast.remove();
    toast.success('Copied');
  };

  const onClickUseDefault = () => {
    if (useWallet !== 'default') {
      setUseWallet('default');
      if (
        step === 'showAddress' &&
        userAddress &&
        userAddress.evm &&
        userAddress.taproot
      ) {
        // setReceiverAddress(userAddress.evm);
        // debounceGetBTCAddress(userAddress.taproot, userAddress.evm, quantity);
      }
    }
  };

  const onClickUseAnother = () => {
    if (useWallet !== 'another') {
      setUseWallet('another');
    }
  };

  const onClickPay = () => {
    if (useWallet === 'default') {
      if (userAddress && userAddress.evm && userAddress.taproot) {
        // setReceiverAddress(userAddress.evm);
        setsTep('showAddress');
        // debounceGetBTCAddress(userAddress.taproot, userAddress.evm, quantity);
      }
    }
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCAddressTaproot(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else {
      if (step === 'showAddress' && addressInput !== values.address) {
        setAddressInput(values.address);
        setReceiverAddress(userAddress.evm);

        // debounceGetBTCAddress(values.address, userAddress.evm, quantity);
      }
    }

    return errors;
  };

  //   const handleSubmit = async (values: IFormValue): Promise<void> => {
  //     if (addressInput !== values.address) {
  //       setReceiverAddress(userAddress.evm);

  //       //   debounceGetBTCAddress(values.address, userAddress.evm, quantity);
  //       setAddressInput(values.address);
  //     }
  //   };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (!fileBase64) {
      return;
    }

    try {
      const { address } = values;
      setIsMinting(true);
      setInscriptionInfo(null);
      const payload: IGenerateReceiverAddressPayload = {
        walletAddress: address || user?.walletAddressBtcTaproot || '',
        fileName: file?.name || '',
        file: fileBase64,
        fee_rate: InscribeMintFeeRate.ECONOMY,
      };
      if (tokenAddress) {
        payload.tokenAddress = tokenAddress as string;
      }
      if (tokenId) {
        payload.tokenId = tokenId as string;
      }
      const res = await generateReceiverAddress(payload);
      setInscriptionInfo(res);
      setReceiverAddress(res?.segwitAddress);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.remove();
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsMinting(false);
    }
  };

  const _onClose = () => {
    setErrMessage('');
    // setIsPopupPayment(false);
    handleClose();
  };

  return (
    <div className={s.mintBTCGenerativeModal}>
      <div className={s.backdrop}>
        <div
          className={`${s.modalWrapper}  ${
            step === 'info' ? s.showInfo : s.showAddress
          }`}
        >
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <ButtonIcon
                onClick={_onClose}
                className={s.closeBtn}
                variants="ghost"
                type="button"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </ButtonIcon>
            </div>
            <Col className={s.modalBody}>
              <Row className={s.row}>
                <Col md={step === 'info' ? '12' : '6'}>
                  <h3 className={s.modalTitle}>Payment</h3>
                  <div className={s.payment}>
                    {/* <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_title}>
                        Estimate inscription fee
                      </p>
                      <p className={s.paymentPrice_price}>
                        {`${formatBTCPrice(
                          calculateMintFee(
                            InscribeMintFeeRate.ECONOMY,
                            file?.size || 0,
                            !!isAuthentic
                          )
                        )} ETH`}
                      </p>
                    </div> */}
                    {/* <div className={s.indicator} /> */}

                    <div className={s.paymentPrice}>
                      <p className={s.paymentPrice_total}>
                        {' '}
                        Estimate inscription fee
                      </p>
                      <div
                        className={s.paymentPrice_copyContainer}
                        onClick={() => onClickCopy(`${totalFormatPrice}`)}
                      >
                        <SvgInset
                          className={s.ic}
                          size={18}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                        />
                        <p className={s.text}>{`${totalFormatPrice} ETH`}</p>
                      </div>
                    </div>
                  </div>
                  <div className={s.formWrapper}>
                    <div className={s.advancedContainer}>
                      <h3 className={s.modalTitleAdvanced}>Advanced</h3>
                      <SvgInset
                        className={`${s.icArrow} ${
                          isShowAdvance ? s.close : ''
                        }`}
                        size={20}
                        svgUrl={`${CDN_URL}/icons/arrow-up.svg`}
                        onClick={() => setIsShowAdvance(!isShowAdvance)}
                      />
                    </div>
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
                          {isShowAdvance && (
                            <>
                              <div className={s.checkboxContainer}>
                                <div className={s.checkbox}>
                                  <SvgInset
                                    className={s.checkbox_ic}
                                    size={18}
                                    svgUrl={`${CDN_URL}/icons/${
                                      useWallet === 'default'
                                        ? 'ic_checkboxed'
                                        : 'ic_checkbox'
                                    }.svg`}
                                    onClick={onClickUseDefault}
                                  />
                                  <p className={s.checkbox_text}>
                                    Your Generative Wallet
                                  </p>
                                </div>
                                <div
                                  className={s.checkbox}
                                  style={{ marginLeft: 24 }}
                                >
                                  <SvgInset
                                    className={s.checkbox_ic}
                                    size={18}
                                    svgUrl={`${CDN_URL}/icons/${
                                      useWallet === 'another'
                                        ? 'ic_checkboxed'
                                        : 'ic_checkbox'
                                    }.svg`}
                                    onClick={onClickUseAnother}
                                  />
                                  <p className={s.checkbox_text}>
                                    Send to another wallet
                                  </p>
                                </div>
                              </div>
                              {useWallet === 'default' && (
                                <div className={s.noteContainer}>
                                  Your Ordinal inscription will be stored
                                  securely in your Generative Wallet. We
                                  recommend Generative Wallet for ease-of-use,
                                  security, and the best experience on
                                  Generative.
                                </div>
                              )}

                              {useWallet === 'another' && (
                                <div className={s.formItem}>
                                  <div className={s.inputContainer}>
                                    <input
                                      id="address"
                                      type="text"
                                      name="address"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.address}
                                      className={s.input}
                                      placeholder={`Paste your Ordinals-compatible BTC address here`}
                                    />
                                  </div>
                                  {errors.address && touched.address && (
                                    <p className={s.inputError}>
                                      {errors.address}
                                    </p>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {step === 'info' && useWallet === 'another' && (
                            <ButtonIcon
                              type="submit"
                              sizes="large"
                              className={s.buyBtn}
                              disabled={isLoading || quantity === 0}
                            >
                              Inscribe
                            </ButtonIcon>
                          )}
                        </form>
                      )}
                    </Formik>

                    {step === 'info' && useWallet === 'default' && (
                      <ButtonIcon
                        sizes="large"
                        className={s.buyBtn}
                        disabled={isLoading || quantity === 0}
                        onClick={onClickPay}
                      >
                        Inscribe
                      </ButtonIcon>
                    )}

                    {step === 'info' && isLoading && (
                      <div className={s.loadingWrapper}>
                        <Loading isLoaded={false} />
                      </div>
                    )}

                    {!!errMessage && (
                      <div className={s.error}>{errMessage}</div>
                    )}
                  </div>
                </Col>

                {step === 'showAddress' && inscriptionInfo && !isMinting && (
                  <Col md={'6'}>
                    <div className={s.paymentWrapper}>
                      {receiverAddress && !isLoading && (
                        <div className={s.qrCodeWrapper}>
                          <p className={s.qrTitle}>
                            Send{' '}
                            <span style={{ fontWeight: 'bold' }}>
                              {formatBTCPrice(
                                new BigNumber(
                                  inscriptionInfo?.amount || 0
                                ).toNumber()
                              )}{' '}
                              ETH
                            </span>{' '}
                            to this address
                          </p>

                          <div className={s.btcAddressContainer}>
                            <p className={s.btcAddress}>
                              {ellipsisCenter({
                                str: inscriptionInfo.segwitAddress || '',
                                limit: 16,
                              })}
                            </p>
                            <SvgInset
                              className={s.icCopy}
                              size={18}
                              svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                              onClick={() => onClickCopy(receiverAddress || '')}
                            />
                          </div>

                          <QRCodeGenerator
                            className={s.qrCodeGenerator}
                            size={128}
                            value={receiverAddress || ''}
                          />
                        </div>
                      )}
                      {isLoading && (
                        <div className={s.loadingWrapper}>
                          <Loading isLoaded={false} />
                        </div>
                      )}
                    </div>

                    <div className={s.btnContainer}>
                      {isSent && (
                        <>
                          <ButtonIcon
                            sizes="large"
                            className={s.buyBtn}
                            onClick={() => router.push(ROUTE_PATH.PROFILE)}
                            variants="outline"
                          >
                            <Text as="span" size="16" fontWeight="medium">
                              Check order status
                            </Text>
                          </ButtonIcon>
                          <div style={{ width: 16 }} />
                          <ButtonIcon
                            sizes="large"
                            className={s.buyBtn}
                            onClick={_onClose}
                          >
                            <Text as="span" size="16" fontWeight="medium">
                              Continue collecting
                            </Text>
                          </ButtonIcon>
                        </>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InscribeEthModal;
