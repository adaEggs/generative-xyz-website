import s from './styles.module.scss';
import {
  CDN_URL,
  CHUNK_SIZE,
  MIN_MINT_BTC_PROJECT_PRICE,
} from '@constants/config';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import _get from 'lodash/get';
import Text from '@components/Text';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import {
  completeMultipartUpload,
  initiateMultipartUpload,
  uploadFile,
} from '@services/file';
import { CollectionType } from '@enums/mint-generative';
import { createBTCProject, getProjectDetail } from '@services/project';
import { ICreateBTCProjectPayload } from '@interfaces/api/project';
import { blobToBase64, fileToBase64 } from '@utils/file';
// import { validateBTCAddressTaproot } from '@utils/validate';
import { detectUsedLibs } from '@utils/sandbox';
import { getMempoolFeeRate } from '@services/mempool';
import { calculateNetworkFee } from '@utils/inscribe';
import { getUserSelector } from '@redux/user/selector';
import { sendAAEvent } from '@services/aa-tracking';
import { formatBTCPrice } from '@utils/format';
import { useSelector } from 'react-redux';
import useChunkedFileUploader from '@hooks/useChunkedFileUploader';
import ProgressBar from '@components/ProgressBar';
import { InscribeMintFeeRate } from '@enums/inscribe';

const LOG_PREFIX = 'SetPrice';

type ISetPriceFormValue = {
  maxSupply: string | number;
  mintPrice: string | number;
  royalty: string | number;
  // creatorWalletAddress: string;
};

const SetPrice = () => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    thumbnailFile,
    setShowErrorAlert,
    rawFile,
    collectionType,
    setMintedProjectID,
    imageCollectionFile,
    filesSandbox,
  } = useContext(MintBTCGenerativeContext);
  const [isMinting, setIsMinting] = useState(false);
  const [feeRate, setFeeRate] = useState<number>(-1);
  const [networkFee, setNetworkFee] = useState(0);
  const numberOfFile = imageCollectionFile
    ? Object.keys(imageCollectionFile).length
    : 0;
  const { uploadFile: uploadChunkFile, uploadProgress } =
    useChunkedFileUploader();

  const fetchNetworkFee = async (): Promise<number> => {
    try {
      const res = await getMempoolFeeRate();
      setFeeRate(res.fastestFee);
      return res.fastestFee;
    } catch (err: unknown) {
      log('fetchNetworkFee error', LogLevel.ERROR, LOG_PREFIX);
      return -1;
    }
  };

  const getEstimateNetworkFee = async (): Promise<void> => {
    try {
      let networkFeeRate = feeRate;
      if (networkFeeRate < 0) {
        networkFeeRate = await fetchNetworkFee();
      }

      if (networkFeeRate < 0) {
        networkFeeRate = InscribeMintFeeRate.FASTEST;
      }

      if (collectionType === CollectionType.GENERATIVE) {
        if (!rawFile) {
          setNetworkFee(0);
          return;
        }

        const fileBase64 = await fileToBase64(rawFile);
        const sats = calculateNetworkFee(
          networkFeeRate,
          fileBase64 as string,
          0
        );
        setNetworkFee(sats);
      }

      if (collectionType === CollectionType.COLLECTION) {
        if (!imageCollectionFile) {
          setNetworkFee(0);
          return;
        }
        const [_, largestFile] = Object.entries(imageCollectionFile).reduce(
          (prev, current) => {
            const [_prevK, _prevV] = prev;
            const [_currentK, _currentV] = current;

            return _prevV.blob.size > _currentV.blob.size ? prev : current;
          }
        );

        const fileBase64 = await blobToBase64(largestFile.blob);
        const sats = calculateNetworkFee(
          networkFeeRate,
          fileBase64 as string,
          0
        );
        setNetworkFee(sats);
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const validateForm = (values: ISetPriceFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Update data
    setFormValues({
      ...formValues,
      ...{
        // creatorWalletAddress: values.creatorWalletAddress || '',
        maxSupply: values.maxSupply
          ? parseInt(values.maxSupply.toString(), 10)
          : undefined,
        mintPrice: values.mintPrice
          ? parseFloat(values.mintPrice.toString())
          : undefined,
        royalty: values.royalty
          ? parseInt(values.royalty.toString(), 10)
          : undefined,
      },
    });

    // if (!values.creatorWalletAddress.toString()) {
    //   errors.creatorWalletAddress = 'Creator wallet address is required.';
    // } else if (!validateBTCAddress(values.creatorWalletAddress)) {
    //   errors.creatorWalletAddress = 'Invalid BTC wallet address.';
    // }

    if (!values.maxSupply.toString()) {
      errors.maxSupply = 'Number of editions is required.';
    } else if (parseInt(values.maxSupply.toString(), 10) <= 0) {
      errors.maxSupply = 'Invalid number. Must be greater than 0.';
    } else if (
      collectionType === CollectionType.COLLECTION &&
      parseInt(values.maxSupply.toString(), 10) > numberOfFile
    ) {
      errors.maxSupply = `Invalid number. Must be equal or less than ${numberOfFile}.`;
    }

    if (!values.mintPrice.toString()) {
      errors.mintPrice = 'Price is required.';
    } else if (
      parseFloat(values.mintPrice.toString()) < MIN_MINT_BTC_PROJECT_PRICE
    ) {
      errors.mintPrice = `Invalid number. Must be equal or greater than ${MIN_MINT_BTC_PROJECT_PRICE}.`;
    }

    if (!values.royalty.toString()) {
      errors.royalty = 'Royalty is required.';
    } else if (parseInt(values.royalty.toString(), 10) < 0) {
      errors.royalty = 'Invalid number. Must be equal or greater than 0.';
    } else if (parseInt(values.royalty.toString(), 10) > 25) {
      errors.royalty = 'Invalid number. Must be  less then 25.';
    }

    return errors;
  };

  const intervalGetProjectStatus = (projectID: string): void => {
    const intervalID = setInterval(async () => {
      try {
        const projectRes = await getProjectDetail({
          contractAddress: GENERATIVE_PROJECT_CONTRACT,
          projectID,
        });
        if (projectRes && !projectRes.isHidden && projectRes.status) {
          setMintedProjectID(projectRes.tokenID);
          setIsMinting(false);
          clearInterval(intervalID);
          router.push('/create/mint-success', undefined, {
            shallow: true,
          });
        }
      } catch (err) {
        log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      }
    }, 5000);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!rawFile || isMinting) {
      log('Raw file not found', LogLevel.ERROR, LOG_PREFIX);
      return;
    }

    try {
      setIsMinting(true);

      const {
        // creatorWalletAddress,
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
        // creatorAddrrBTC: creatorWalletAddress ?? '',
        maxSupply: maxSupply ?? 0,
        limitSupply: 0,
        mintPrice: mintPrice?.toString() ? mintPrice.toString() : '0',
        name: name ?? '',
        description: description ?? '',
        thumbnail: thumbnailUrl,
        thirdPartyScripts: thirdPartyScripts ?? [],
        scripts: [],
        styles: '',
        tokenDescription: tokenDescription ?? '',
        royalty: royalty !== undefined ? royalty * 100 : 0,
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
        isFullChain: true,
      };

      if (collectionType === CollectionType.COLLECTION) {
        try {
          const initUploadRes = await initiateMultipartUpload({
            fileName: rawFile.name,
            group: payload.name.toLowerCase().replaceAll(' ', '_'),
          });

          await uploadChunkFile(initUploadRes.uploadId, rawFile, CHUNK_SIZE);

          const completeUploadRes = await completeMultipartUpload({
            uploadId: initUploadRes.uploadId,
          });
          payload.zipLink = completeUploadRes.fileUrl;
        } catch (err: unknown) {
          log(err as Error, LogLevel.ERROR, LOG_PREFIX);
          setShowErrorAlert({ open: true, message: 'Upload file error.' });
          setIsMinting(false);
          return;
        }
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

      // Send tracking
      sendAAEvent({
        eventName: BTC_PROJECT.LAUNCH_NEW_PROJECT,
        data: {
          ...projectRes,
          artistName: user?.displayName ?? '',
        },
      });

      // Polling to get project status
      intervalGetProjectStatus(projectRes.tokenID);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      setShowErrorAlert({ open: true, message: null });
      setIsMinting(false);
    }
  };

  useEffect(() => {
    getEstimateNetworkFee();
  }, [rawFile, collectionType, imageCollectionFile]);

  return (
    <Formik
      key="setPriceForm"
      initialValues={{
        maxSupply: formValues.maxSupply || '',
        mintPrice: formValues.mintPrice || '',
        royalty: formValues.royalty || '',
        // creatorWalletAddress: formValues.creatorWalletAddress ?? '',
      }}
      validate={validateForm}
      onSubmit={handleSubmit}
      validateOnChange
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
                  Price <sup className={s.requiredTag}>*</sup>
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
                {networkFee && (
                  <Text
                    as={'p'}
                    size={'14'}
                    color={'black-60'}
                    className={s.inputDesc}
                  >
                    {`Estimate network fee ${formatBTCPrice(networkFee)} BTC`}
                  </Text>
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
              </div>
            </div>
            <div className={s.container}>
              {isMinting && (
                <div className={s.loadingContainer}>
                  <p className={s.progressText}>
                    Uploading -{' '}
                    <b>{`${
                      uploadProgress === 100 ? 'Done' : `${uploadProgress}%`
                    }`}</b>
                  </p>
                  <ProgressBar
                    height={6}
                    percent={uploadProgress}
                  ></ProgressBar>
                </div>
              )}
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
                  {isMinting ? 'Creating...' : 'Publish collection'}
                </ButtonIcon>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SetPrice;
