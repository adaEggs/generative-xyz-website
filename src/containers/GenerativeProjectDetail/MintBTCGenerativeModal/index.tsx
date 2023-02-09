import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Formik } from 'formik';
import s from './styles.module.scss';
// import Web3 from 'web3';
import QRCodeGenerator from '@components/QRCodeGenerator';
import {
  covertPriceToBTC,
  generateReceiverAddress,
  mintBTCGenerative,
} from '@services/btc';
import { Loading } from '@components/Loading';
import _debounce from 'lodash/debounce';
import { validateBTCWalletAddress } from '@utils/validate';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';

interface IFormValue {
  address: string;
}

interface IProp {
  setIsShowSuccess: Dispatch<SetStateAction<boolean>>;
}

const LOG_PREFIX = 'MintBTCGenerativeModal';

const MintBTCGenerativeModal: React.FC<IProp> = ({
  setIsShowSuccess,
}): React.ReactElement => {
  const { projectData, hideMintBTCModal } = useContext(
    GenerativeProjectDetailContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>();
  const [_isMinting, setIsMinting] = useState(false);
  const [step, setsTep] = useState<'info' | 'mint'>('info');

  const getBTCAddress = async (walletAddress: string): Promise<void> => {
    if (!projectData) return;

    try {
      setIsLoading(true);
      setReceiverAddress(null);
      const { address, price: _price } = await generateReceiverAddress({
        walletAddress,
        projectID: projectData.tokenID,
      });

      setReceiverAddress(address);
      setPrice(projectData?.mintPrice);
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
      debounceGetBTCAddress(values.address);
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
      setIsShowSuccess(true);
      // toast.success('Mint success');
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsMinting(false);
    }
  };

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
                  hideMintBTCModal();
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
                                placeholder="Enter your BTC wallet address"
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
                                <label className={s.label} htmlFor="price">
                                  Set a price{' '}
                                  <sup className={s.requiredTag}>*</sup>
                                </label>
                                <div className={s.inputContainer}>
                                  <input
                                    disabled
                                    id="price"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={covertPriceToBTC(Number(price))}
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

export default MintBTCGenerativeModal;
