import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import _get from 'lodash/get';
import Text from '@components/Text';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import { uploadFile } from '@services/file';
import { CollectionType } from '@enums/mint-generative';
import { createBTCProject, uploadBTCProjectFiles } from '@services/project';
import { v4 as uuidv4 } from 'uuid';
import { ICreateBTCProjectPayload } from '@interfaces/api/project';
import { fileToBase64 } from '@utils/file';
import { validateBTCWalletAddress } from '@utils/validate';
import { detectUsedLibs } from '@utils/sandbox';

const LOG_PREFIX = 'SetPrice';

type ISetPriceFormValue = {
  maxSupply: number;
  mintPrice: number;
  royalty: number;
  creatorWalletAddress: string;
};

const SetPrice = () => {
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    thumbnailFile,
    setShowErrorAlert,
    rawFile,
    collectionType,
    setMintedProjectID,
    filesSandbox,
  } = useContext(MintBTCGenerativeContext);
  const [isMinting, setIsMinting] = useState(false);

  const validateForm = (values: ISetPriceFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Update data
    setFormValues({
      ...formValues,
      ...{
        creatorWalletAddress: values.creatorWalletAddress ?? '',
        maxSupply: values.maxSupply.toString() ? values.maxSupply : 0,
        mintPrice: values.mintPrice.toString()
          ? values.mintPrice.toString()
          : '0',
        royalty: values.royalty.toString() ? values.royalty : 10,
      },
    });

    if (!values.creatorWalletAddress.toString()) {
      errors.creatorWalletAddress = 'Creator wallet address is required.';
    } else if (!validateBTCWalletAddress(values.creatorWalletAddress)) {
      errors.creatorWalletAddress = 'Invalid BTC wallet address.';
    }

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
    if (!rawFile || isMinting) {
      log('Raw file not found', LogLevel.ERROR, LOG_PREFIX);
      return;
    }

    try {
      setIsMinting(true);

      const {
        creatorWalletAddress,
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

      let thumbnailUrl = '';
      if (thumbnailFile) {
        const uploadRes = await uploadFile({ file: thumbnailFile });
        thumbnailUrl = uploadRes.url;
      }

      const payload: ICreateBTCProjectPayload = {
        creatorAddrr: creatorWalletAddress ?? '',
        maxSupply: maxSupply ?? 0,
        limitSupply: maxSupply ?? 0,
        mintPrice: mintPrice?.toString() ? mintPrice.toString() : '0',
        name: name ?? '',
        description: description ?? '',
        thumbnail: thumbnailUrl,
        thirdPartyScripts: thirdPartyScripts ?? [],
        scripts: [],
        styles: '',
        tokenDescription: tokenDescription ?? '',
        royalty: royalty ? royalty * 100 : 1000,
        socialDiscord: socialDiscord ?? '',
        socialInstagram: socialInstagram ?? '',
        socialMedium: socialMedium ?? '',
        socialTwitter: socialTwitter ?? '',
        socialWeb: socialWeb ?? '',
        license: license ?? '',
        categories: categories ?? [],
        closeMintUnixTimestamp: 0,
        openMintUnixTimestamp: 0,
        tags: tags ?? [],
        zipLink: '',
        animationURL: '',
        isFullChain: false,
      };

      if (collectionType === CollectionType.IMAGES) {
        const uploadRes = await uploadBTCProjectFiles({
          file: rawFile,
          projectName: name ?? uuidv4(),
        });
        payload.zipLink = uploadRes.url;
      }

      if (collectionType === CollectionType.GENERATIVE) {
        const animationURL = await fileToBase64(rawFile);
        payload.animationURL = animationURL as string;
        if (filesSandbox) {
          const libs = await detectUsedLibs(filesSandbox);
          payload.isFullChain = libs.length === 0;
        }
      }

      const projectRes = await createBTCProject(payload);
      setMintedProjectID(projectRes.tokenID);
      router.push('/create/mint-success', undefined, {
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
        creatorWalletAddress: formValues.creatorWalletAddress ?? '',
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
                <label className={s.label} htmlFor="creatorWalletAddress">
                  Creator BTC wallet address{' '}
                  <sup className={s.requiredTag}>*</sup>
                </label>
                <div className={s.inputContainer}>
                  <input
                    id="creatorWalletAddress"
                    type="text"
                    name="creatorWalletAddress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.creatorWalletAddress}
                    className={s.input}
                    placeholder="Provide your BTC wallet address"
                  />
                </div>
                {errors.creatorWalletAddress &&
                  touched.creatorWalletAddress && (
                    <p className={s.error}>{errors.creatorWalletAddress}</p>
                  )}
                <Text
                  as={'p'}
                  size={'14'}
                  color={'black-60'}
                  className={s.inputDesc}
                >
                  Set up your BTC wallet address
                </Text>
              </div>
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
                    value={values.mintPrice}
                    className={s.input}
                    placeholder="Provide a number"
                  />
                  <div className={s.inputPostfix}>BTC</div>
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
