import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, {
  useMemo,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
import QRCodeGenerator from '@components/QRCodeGenerator';
import { mintBTCGenerative } from '@services/btc';
import { Loading } from '@components/Loading';
import _debounce from 'lodash/debounce';
import { validateBTCWalletAddress } from '@utils/validate';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import { formatEthPrice } from '@utils/format';
import { generateETHReceiverAddress } from '@services/eth';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';

interface IFormValue {
  address: string;
}

const LOG_PREFIX = 'MintEthModal';

const MintEthModal: React.FC = () => {
  const user = useAppSelector(getUserSelector);
  const { projectData, hideMintBTCModal } = useContext(
    GenerativeProjectDetailContext
  );

  const { connect, transfer } = useContext(WalletContext);
  const { setIsPopupPayment, paymentMethod } = useContext(
    BitcoinProjectContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [_isMinting, setIsMinting] = useState(false);
  const [step, setsTep] = useState<'info' | 'mint' | null>(null);
  const [addressInput, setAddressInput] = useState<string>('');
  const [_isConnecting, setIsConnecting] = useState<boolean>(false);

  const userBtcAddress = useMemo(() => user?.walletAddressBtc, [user]);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTransfer = async (
    toAddress: string,
    val: string
  ): Promise<void> => {
    try {
      await transfer(toAddress, val);
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    }
  };

  const getBTCAddress = async (walletAddress: string): Promise<void> => {
    if (!projectData) return;

    try {
      setIsLoading(true);
      setReceiverAddress(null);

      const { address, price: price } = await generateETHReceiverAddress({
        walletAddress,
        projectID: projectData.tokenID,
      });

      sendAAEvent({
        eventName: BTC_PROJECT.MINT_NFT,
        data: {
          projectId: projectData.id,
          projectName: projectData.name,
          projectThumbnail: projectData.image,
          mintPrice: formatEthPrice(projectData?.mintPrice),
          mintType: paymentMethod,
          networkFee: formatEthPrice(projectData?.networkFee || null),
          masterAddress: address,
          totalPrice: formatEthPrice(price),
        },
      });

      setReceiverAddress(address);
      setPrice(price || projectData?.mintPrice);
    } catch (err: unknown) {
      setReceiverAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetBTCAddress = useCallback(
    _debounce(nextValue => getBTCAddress(nextValue), 1000),
    [projectData]
  );

  const validateForm = (values: IFormValue) => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Wallet address is required.';
    } else if (!validateBTCWalletAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    } else {
      if (addressInput !== values.address) {
        setAddressInput(values.address);
        debounceGetBTCAddress(values.address);
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!projectData || !receiverAddress) return;

    try {
      setIsMinting(true);
      await mintBTCGenerative({
        address: receiverAddress,
      });
      hideMintBTCModal();
      // toast.success('Mint success');
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsMinting(false);
    }
  };
  const priceMemo = useMemo(() => formatEthPrice(price), [price]);

  useEffect(() => {
    if (!user && receiverAddress) {
      handleConnectWallet();
    } else if (user && receiverAddress && price) {
      handleTransfer(receiverAddress, formatEthPrice(price));
    }
  }, [receiverAddress, user, price]);

  useEffect(() => {
    if (userBtcAddress) {
      setsTep('mint');
      getBTCAddress(userBtcAddress);
    } else {
      setsTep('info');
    }
  }, [userBtcAddress]);

  if (!projectData) {
    return <></>;
  }

  return (
    <div className={s.mintBTCGenerativeModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={() => {
                  setIsPopupPayment(false);
                  setsTep('info');
                }}
                className={s.closeBtn}
                variants="ghost"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              {step === 'info' ? (
                <div className={s.modalBody_nextStep}>
                  <h3 className={s.modalTitle}>Setup BTC wallet address</h3>
                  <div className={s.formWrapper}>
                    <p>
                      Please follow this step-by-step{' '}
                      <a
                        href="https://gist.github.com/windsok/5b53a1ced6ef3eddbde260337de28980"
                        target="_blank"
                        rel="noreferrer"
                      >
                        guide
                      </a>{' '}
                      to create an ord compatible wallet with Sparrow Wallet in
                      order to receive ordinals and inscriptions.
                    </p>
                    <p>Disregard this step if you have already set it up.</p>

                    <div className={s.ctas}>
                      <Button
                        type="submit"
                        variants={'ghost'}
                        onClick={() => setsTep('mint')}
                        className={s.submitBtn}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className={s.modalTitle}>Mint NFT</h3>
                  <div className={s.alert_info}>
                    Do not spend any satoshis from this wallet unless you
                    understand what you are doing. If you ignore this warning,
                    you could inadvertently lose access to your ordinals and
                    inscriptions.
                  </div>
                  <div className={s.formWrapper}>
                    <Formik
                      key="mintBTCGenerativeForm"
                      initialValues={{
                        address: userBtcAddress || '',
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
                              Transfer NFT to{' '}
                              <sup className={s.requiredTag}>*</sup>
                            </label>
                            <div className={s.inputContainer}>
                              <input
                                id="address"
                                type="address"
                                name="address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                className={s.input}
                                placeholder="Paste your BTC Ordinal wallet address here"
                              />
                            </div>
                            {errors.address && touched.address && (
                              <p className={s.inputError}>{errors.address}</p>
                            )}
                          </div>
                          {isLoading && (
                            <div className={s.loadingWrapper}>
                              <Loading isLoaded={false}></Loading>
                            </div>
                          )}
                          {receiverAddress && price && !isLoading && (
                            <>
                              <div className={s.formItem}>
                                {projectData?.networkFeeEth ? (
                                  <label className={s.label} htmlFor="price">
                                    Total Price (
                                    {formatEthPrice(
                                      projectData?.mintPriceEth || null
                                    )}{' '}
                                    NFT PRICE +{' '}
                                    {formatEthPrice(projectData?.networkFeeEth)}{' '}
                                    Network Fees)
                                    <sup className={s.requiredTag}>*</sup>
                                  </label>
                                ) : (
                                  <label className={s.label} htmlFor="price">
                                    Price <sup className={s.requiredTag}>*</sup>
                                  </label>
                                )}
                                <div className={s.inputContainer}>
                                  <input
                                    disabled
                                    id="price"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={priceMemo}
                                    className={s.input}
                                  />
                                  <div className={s.inputPostfix}>ETH</div>
                                </div>
                              </div>
                              <div className={s.qrCodeWrapper}>
                                <p className={s.qrTitle}>
                                  Send ETH to this deposit address
                                </p>
                                <QRCodeGenerator
                                  className={s.qrCodeGenerator}
                                  size={128}
                                  value={receiverAddress}
                                />
                                <p className={s.btcAddress}>
                                  {receiverAddress}
                                </p>
                              </div>
                            </>
                          )}
                        </form>
                      )}
                    </Formik>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintEthModal;
