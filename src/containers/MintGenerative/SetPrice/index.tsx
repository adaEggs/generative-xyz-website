import s from './styles.module.scss';
import { TransactionReceipt } from 'web3-eth';
import { CDN_URL, NETWORK_CHAIN_ID } from '@constants/config';
import { MintGenerativeContext } from '@contexts/mint-generative-context';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { WalletContext } from '@contexts/wallet-context';
import MintGenerativeProjectOperation from '@services/contract-operations/generative-project/mint-generative-project';
import { IMintGenerativeProjectParams } from '@interfaces/contract-operations/mint-generative-project';
import useContractOperation from '@hooks/useContractOperation';
import { IGetParameterControlParams } from '@interfaces/contract-operations/get-parameter-control';
import GetParamControlOperation from '@services/contract-operations/parameter-control/get-parameter-control';
import { ParameterControlKey } from '@enums/parameter-key';
import { readSandboxFileContent } from '@utils/sandbox';
import { uploadFile } from '@services/file';
import { CSS_EXTENSION, JS_EXTENSION } from '@constants/file';
import _get from 'lodash/get';
import { createProjectMetadata } from '@services/project';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { isTestnet } from '@utils/chain';
import Web3 from 'web3';
import Text from '@components/Text';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';

const LOG_PREFIX = 'SetPrice';

type ISetPriceFormValue = {
  maxSupply: number;
  mintPrice: number;
  royalty: number;
};

const SetPrice = () => {
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    filesSandbox,
    thumbnailFile,
    setMintedProjectID,
    setShowErrorAlert,
  } = useContext(MintGenerativeContext);
  const walletCtx = useContext(WalletContext);
  const { call: mintProject, reset: resetContractOperation } =
    useContractOperation<IMintGenerativeProjectParams, TransactionReceipt>(
      MintGenerativeProjectOperation,
      true
    );
  const { call: getParamControl } = useContractOperation<
    IGetParameterControlParams,
    number
  >(GetParamControlOperation, true);
  const [isMinting, setIsMinting] = useState(false);

  const validateForm = (values: ISetPriceFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Update data
    setFormValues({
      ...formValues,
      ...{
        maxSupply: values.maxSupply.toString() ? values.maxSupply : 0,
        mintPrice: values.mintPrice.toString()
          ? values.mintPrice.toString()
          : '0',
        royalty: values.royalty.toString() ? values.royalty : 10,
      },
    });

    if (!values.maxSupply.toString()) {
      errors.maxSupply = 'Number of editions is required.';
    } else if (values.maxSupply <= 0) {
      errors.maxSupply = 'Invalid number. Must be greater than 0.';
    }

    if (!values.mintPrice.toString()) {
      errors.mintPrice = 'Price is required.';
    } else if (values.mintPrice < 0) {
      errors.mintPrice = 'Invalid number. Must be equal or greater than 0.';
    }

    if (!values.royalty.toString()) {
      errors.royalty = 'Royalty is required.';
    } else if (values.royalty < 10 || values.royalty > 25) {
      errors.royalty = 'Invalid number. Must be between 10 and 25.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!filesSandbox) {
      log('No sandbox files', LogLevel.DEBUG, LOG_PREFIX);
      return;
    }

    if (!walletCtx.walletManager) {
      log('No wallet manager', LogLevel.DEBUG, LOG_PREFIX);
      return;
    }

    try {
      setIsMinting(true);
      resetContractOperation();

      const {
        description,
        license,
        maxSupply,
        mintPrice,
        name,
        royalty,
        socialDiscord,
        socialInstagram,
        socialMedium,
        socialTwitter,
        socialWeb,
        thirdPartyScripts,
        tokenDescription,
        categories,
        tags,
      } = formValues;

      const mintFee = await getParamControl({
        key: ParameterControlKey.CREATE_PROJECT_FEE,
        chainID: NETWORK_CHAIN_ID,
      });

      if (mintFee === null) {
        log('No mint fee', LogLevel.DEBUG, LOG_PREFIX);
        return;
      }

      const walletBalance = await walletCtx.getWalletBalance();

      if (walletBalance < parseFloat(Web3.utils.fromWei(mintFee.toString()))) {
        if (isTestnet()) {
          setShowErrorAlert({
            open: true,
            message:
              'Insufficient funds testnet. Go to profile and get testnet faucet',
          });
        } else {
          setShowErrorAlert({
            open: true,
            message: 'Insufficient funds.',
          });
        }
        return;
      }

      const fileContents = await readSandboxFileContent(filesSandbox);

      let thumbnailUrl = '';
      if (thumbnailFile) {
        const uploadRes = await uploadFile({ file: thumbnailFile });
        thumbnailUrl = uploadRes.url;
      }

      const projectPayload: IMintGenerativeProjectParams = {
        chainID: NETWORK_CHAIN_ID,
        maxSupply: maxSupply ?? 0,
        limitSupply: maxSupply ?? 0,
        mintPrice: mintPrice?.toString() ? mintPrice.toString() : '0',
        name: name ?? '',
        creatorName: '',
        description: description ?? '',
        thumbnail: thumbnailUrl,
        thirdPartyScripts: thirdPartyScripts ?? [],
        scripts: [...fileContents[JS_EXTENSION]] ?? [],
        styles: fileContents[CSS_EXTENSION]
          ? fileContents[CSS_EXTENSION][0]
          : '',
        tokenDescription: tokenDescription ?? '',
        reservationList: [],
        royalty: royalty ? royalty * 100 : 1000,
        socialDiscord: socialDiscord ?? '',
        socialInstagram: socialInstagram ?? '',
        socialMedium: socialMedium ?? '',
        socialTwitter: socialTwitter ?? '',
        socialWeb: socialWeb ?? '',
        license: license ?? '',
        mintFee: mintFee,
      };

      const mintTx = await mintProject(projectPayload);

      if (!mintTx) {
        setShowErrorAlert({ open: true, message: null });
        return;
      }

      const tokenID: string | null = _get(
        mintTx,
        'events.Transfer.returnValues.tokenId',
        null
      );

      if (tokenID === null) {
        return;
      }

      setMintedProjectID(tokenID);
      await createProjectMetadata({
        tokenID,
        categories: categories ?? [],
        tags: tags ?? [],
        contractAddress: GENERATIVE_PROJECT_CONTRACT,
      });

      router.push('/mint-generative/mint-success', undefined, {
        shallow: true,
      });
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      setShowErrorAlert({ open: true, message: null });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Formik
      key="setPriceForm"
      initialValues={{
        maxSupply: formValues.maxSupply ?? 0,
        mintPrice: parseFloat(formValues.mintPrice ?? '0'),
        royalty: formValues.royalty ?? 10,
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
          <div className={s.setPrice}>
            <div className={s.blockInfo}>
              <h3 className={s.descriptionTitle}>
                How will your piece be sold
              </h3>
              <Text
                size={'16'}
                as={'p'}
                fontWeight={'regular'}
                className={s.description}
              >
                Name your price, the number of outputs and the royalties fee.
                Remember, these numbers can be changed later after publishing.
              </Text>
            </div>
            <div className={s.divider} />
            <div className={s.formWrapper}>
              <div className={s.formItem}>
                <label className={s.label} htmlFor="maxSupply">
                  Number of outputs <sup className={s.requiredTag}>*</sup>
                </label>
                <div className={s.inputContainer}>
                  <input
                    id="maxSupply"
                    type="number"
                    name="maxSupply"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.maxSupply}
                    className={s.input}
                    placeholder="Provide a number"
                  />
                  <div className={s.inputPostfix}>Items</div>
                </div>
                {errors.maxSupply && touched.maxSupply && (
                  <p className={s.error}>{errors.maxSupply}</p>
                )}
                <Text
                  as={'p'}
                  size={'14'}
                  color={'black-60'}
                  className={s.inputDesc}
                >
                  The amount of NFTs can be minted in this collection. After
                  publication, this number can only be reduced.
                </Text>
              </div>
              <div className={s.formItem}>
                <label className={s.label} htmlFor="mintPrice">
                  PRICE <sup className={s.requiredTag}>*</sup>
                </label>
                <div className={s.inputContainer}>
                  <input
                    id="mintPrice"
                    type="number"
                    name="mintPrice"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={
                      values.mintPrice
                        ? values.mintPrice
                        : isTestnet()
                        ? 0.0001
                        : values.mintPrice
                    }
                    className={s.input}
                    placeholder="Provide a number"
                  />
                  <div className={s.inputPostfix}>ETH</div>
                </div>
                {errors.mintPrice && touched.mintPrice && (
                  <p className={s.error}>{errors.mintPrice}</p>
                )}
              </div>
              <div className={s.formItem}>
                <label className={s.label} htmlFor="royalty">
                  Royalties <sup className={s.requiredTag}>*</sup>
                </label>
                <div className={s.inputContainer}>
                  <input
                    id="royalty"
                    type="number"
                    name="royalty"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.royalty}
                    className={s.input}
                    placeholder="Provide a number"
                  />
                  <div className={s.inputPostfix}>%</div>
                </div>
                {errors.royalty && touched.royalty && (
                  <p className={s.error}>{errors.royalty}</p>
                )}
                <Text
                  as={'p'}
                  size={'14'}
                  color={'black-60'}
                  className={s.inputDesc}
                >
                  The payment artists receive every time a secondary sale of
                  their artworks occurs. This number ranges from 10% to 25%.
                </Text>
              </div>
            </div>
          </div>
          <div className={s.container}>
            <div className={s.actionWrapper}>
              <ButtonIcon
                disabled={isMinting}
                type="submit"
                className={s.nextBtn}
                sizes="medium"
                endIcon={
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                  />
                }
              >
                {isMinting ? 'Minting...' : 'Publish collection'}
              </ButtonIcon>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SetPrice;
