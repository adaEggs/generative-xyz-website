import Button from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { SOCIALS } from '@constants/common';
import { CDN_URL, SANDBOX_BTC_FILE_SIZE_LIMIT } from '@constants/config';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import { LogLevel } from '@enums/log-level';
import { CollectionType, MintGenerativeStep } from '@enums/mint-generative';
import { ImageFileError, SandboxFileError } from '@enums/sandbox';
import { getSupportedFileExtList } from '@utils/file';
import { postReferralCode } from '@services/referrals';
import log from '@utils/logger';
import { getReferral } from '@utils/referral';
import { processHTMLFile, processCollectionZipFile } from '@utils/sandbox';
import { prettyPrintBytes } from '@utils/units';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import DropFile from '../DropFile';
import s from './styles.module.scss';

const LOG_PREFIX = 'UploadGenArt';

const UploadGenArt: React.FC = (): ReactElement => {
  const router = useRouter();
  const {
    collectionType,
    setCollectionType,
    filesSandbox,
    setFilesSandbox,
    rawFile,
    setRawFile,
    setShowErrorAlert,
    imageCollectionFile,
    setImageCollectionFile,
  } = useContext(MintBTCGenerativeContext);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const processGenerativeFile = async (file: File) => {
    try {
      const sandboxFiles = await processHTMLFile(file);
      setFilesSandbox(sandboxFiles);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      let errorMessage =
        'There is a problem with your file. Please check and try again. ';
      if ((err as Error).message === SandboxFileError.WRONG_FORMAT) {
        errorMessage += 'Invalid file format.';
      } else if ((err as Error).message === SandboxFileError.TOO_LARGE) {
        errorMessage += `File size error, maximum file size is ${SANDBOX_BTC_FILE_SIZE_LIMIT}kb.`;
      }
      setShowErrorAlert({ open: true, message: errorMessage });
    }
  };

  const processCollectionFile = async (file: File) => {
    try {
      const imageFiles = await processCollectionZipFile(file);
      setImageCollectionFile(imageFiles);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      const errorMessage =
        'There is a problem with your file. Please check and try again.';
      setShowErrorAlert({ open: true, message: errorMessage });
    }
  };

  const handleProccessFile = async (): Promise<void> => {
    if (!rawFile) return;

    if (collectionType === CollectionType.GENERATIVE) {
      await processGenerativeFile(rawFile);
    }

    if (collectionType == CollectionType.COLLECTION) {
      setIsProcessingFile(true);
      await processCollectionFile(rawFile);
      setIsProcessingFile(false);
    }
  };

  const handleChangeFile = (file: File | null): void => {
    setRawFile(file);
  };

  const handleGoToNextStep = (): void => {
    router.push(`/create/${MintGenerativeStep.PROJECT_DETAIL}`, undefined, {
      shallow: true,
    });
  };

  const handleReupload = (): void => {
    setRawFile(null);
    setFilesSandbox(null);
    setImageCollectionFile(null);
  };

  const renderUploadGenerativeSuccess = () => {
    return (
      <>
        <div className={s.uploadSuccessWrapper}>
          <div className={s.zipFileWrapper}>
            <div className={s.uploadFiles}>
              <div className={s.zipFileInfo}>
                <Image
                  className={s.folderIcon}
                  alt="folder icon"
                  width={28}
                  height={28}
                  src={`${CDN_URL}/icons/ic-code-18x18.svg`}
                />
                <Heading
                  as={'h5'}
                  fontWeight={'medium'}
                  color={'primary-color'}
                  className={s.zipFileName}
                >
                  {rawFile?.name} ({prettyPrintBytes(rawFile?.size || 0)})
                </Heading>
              </div>
            </div>
            <div className={s.actionWrapper}>
              <Button sizes="small" variants="outline" onClick={handleReupload}>
                Update HTML file
              </Button>
            </div>
          </div>
          <div className={s.container}>
            <div className={s.checkboxWrapper}>
              {/* <Checkbox
                checked={isProjectWork}
                onClick={handleChangeIsProjectWork}
                className={s.checkbox}
                id="workProperly"
                label="My NFT collection is ready to go!"
              /> */}
            </div>
            <div className={s.actionWrapper}>
              <Button
                disabled={!filesSandbox}
                onClick={handleGoToNextStep}
                endIcon={
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                  />
                }
              >
                Next step
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const fileList = useMemo((): Array<{
    name: string;
    size: number;
    error: ImageFileError | null;
  }> => {
    if (!imageCollectionFile) return [];
    const filedata: Array<{
      name: string;
      size: number;
      error: ImageFileError | null;
    }> = [];
    for (const [key, value] of Object.entries(imageCollectionFile)) {
      filedata.push({
        name: key,
        size: value.blob.size,
        error: value.error,
      });
    }
    return filedata;
  }, [imageCollectionFile]);

  const isValidImageCollection = useMemo((): boolean => {
    return !fileList.some(item => item.error);
  }, [fileList]);

  const getFileError = (errorType: ImageFileError): string => {
    switch (errorType) {
      case ImageFileError.TOO_LARGE:
        return `File size error, maximum file size is ${SANDBOX_BTC_FILE_SIZE_LIMIT}kb.`;
      case ImageFileError.INVALID_EXTENSION:
        return `Invalid file format. Supported file extensions are ${getSupportedFileExtList().join(
          ', '
        )}.`;
      default:
        return '';
    }
  };

  const renderUploadImageCollectionSuccess = () => {
    return (
      <>
        <div className={s.uploadSuccessWrapper}>
          <div className={s.zipFileWrapper}>
            <div className={s.uploadFiles}>
              <div className={s.zipFileInfo}>
                <Image
                  className={s.folderIcon}
                  alt="folder icon"
                  width={28}
                  height={28}
                  src={`${CDN_URL}/icons/ic-folder-code-28x28.svg`}
                />
                <Heading
                  as={'h5'}
                  fontWeight={'medium'}
                  color={'primary-color'}
                  className={s.zipFileName}
                >
                  {rawFile?.name} (
                  {fileList ? `${fileList.length} files - ` : ''}{' '}
                  {prettyPrintBytes(rawFile?.size || 0)})
                </Heading>
              </div>
              <ul className={s.zipFileList}>
                {fileList.map((fileItem, index) => (
                  <li key={index} className={s.fileItem}>
                    <div className={s.fileInfo}>
                      {fileItem.error ? (
                        <SvgInset
                          className={cs(s.codeIcon, s.codeIcon__error)}
                          size={24}
                          svgUrl={`${CDN_URL}/icons/ic-image-error-24x24.svg`}
                        />
                      ) : (
                        <SvgInset
                          className={s.codeIcon}
                          size={24}
                          svgUrl={`${CDN_URL}/icons/ic-image-check-24x24.svg`}
                        />
                      )}
                      <Text
                        as={'span'}
                        size={'18'}
                        color={cs('primary-color', {
                          [`${s.errorText}`]: !!fileItem.error,
                        })}
                        className={s.fileName}
                      >
                        {fileItem.name} {`(${prettyPrintBytes(fileItem.size)})`}
                      </Text>
                    </div>
                    {fileItem.error && (
                      <p className={s.fileError}>
                        {getFileError(fileItem.error)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.actionWrapper}>
              <Button sizes="small" variants="outline" onClick={handleReupload}>
                Update zip file
              </Button>
            </div>
            {!isValidImageCollection && (
              <p className={s.errorMessage}>
                There&apos;re problems with your file. Please check your file
                list above.
              </p>
            )}
          </div>
          <div className={s.container}>
            <div className={s.checkboxWrapper}></div>
            <div className={s.actionWrapper}>
              <Button
                disabled={!isValidImageCollection}
                onClick={handleGoToNextStep}
                endIcon={
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                  />
                }
              >
                Next step
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderUpload = useMemo(
    (): JSX.Element => (
      <>
        <div className={s.uploadWrapper}>
          <Heading as={'h5'} fontWeight={'normal'} className={s.sectionTitle}>
            Upload file
          </Heading>
          <div className={s.collectionTypeWrapper}>
            <p className={s.collectionTypeLabel}>Choose collection type:</p>
            <div className={s.choiceList}>
              <div
                onClick={() => setCollectionType(CollectionType.GENERATIVE)}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.GENERATIVE,
                })}
              >
                Generative
                <span className={s.checkmark}></span>
              </div>
              <div
                onClick={() => setCollectionType(CollectionType.COLLECTION)}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.COLLECTION,
                })}
              >
                File collection
                <span className={s.checkmark}></span>
              </div>
            </div>
            <div className={s.guideWrapper}>
              <p>
                New artist?&nbsp;
                <a
                  href={SOCIALS.docsForArtist}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  Start here.
                </a>
              </p>
            </div>
          </div>
          <div className={s.dropZoneWrapper}>
            <div className={s.loadingOverlay}></div>
            <DropFile
              labelText={
                collectionType === CollectionType.GENERATIVE
                  ? 'Upload your HTML file here.'
                  : 'Upload your ZIP file here.'
              }
              className={s.dropZoneContainer}
              acceptedFileType={
                collectionType === CollectionType.GENERATIVE
                  ? ['html']
                  : ['zip']
              }
              maxSize={
                collectionType === CollectionType.GENERATIVE ? 0.4 : 9999999
              }
              onChange={handleChangeFile}
              fileOrFiles={rawFile ? [rawFile] : null}
              isProcessing={isProcessingFile}
            />
          </div>
        </div>
      </>
    ),
    [rawFile, collectionType, isProcessingFile]
  );

  useEffect(() => {
    handleProccessFile();
  }, [rawFile]);

  const postRefCode = async () => {
    const refCode = getReferral();
    if (refCode) {
      await postReferralCode(refCode);
    }
  };
  useEffect(() => {
    postRefCode();
  }, []);

  return (
    <section className={s.uploadGenArt}>
      {!filesSandbox && !imageCollectionFile ? (
        renderUpload
      ) : (
        <>
          {collectionType === CollectionType.GENERATIVE &&
            renderUploadGenerativeSuccess()}
          {collectionType === CollectionType.COLLECTION &&
            renderUploadImageCollectionSuccess()}
        </>
      )}
    </section>
  );
};

export default UploadGenArt;
