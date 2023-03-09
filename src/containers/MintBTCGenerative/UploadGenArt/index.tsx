import Button from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { SOCIALS } from '@constants/common';
import { CDN_URL, SANDBOX_BTC_IMAGE_SIZE_LIMIT } from '@constants/config';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import { MediaType } from '@enums/file';
import { LogLevel } from '@enums/log-level';
import { CollectionType, MintGenerativeStep } from '@enums/mint-generative';
import { ImageFileError, SandboxFileError } from '@enums/sandbox';
import { postReferralCode } from '@services/referrals';
import {
  getFileExtensionByFileName,
  getMediaTypeFromFileExt,
  getSupportedFileExtList,
} from '@utils/file';
import log from '@utils/logger';
import { getReferral } from '@utils/referral';
import { processCollectionZipFile, processHTMLFile } from '@utils/sandbox';
import { prettyPrintBytes } from '@utils/units';
import cs from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
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
        errorMessage += `File size error, maximum file size is ${SANDBOX_BTC_IMAGE_SIZE_LIMIT}kb.`;
      }
      setShowErrorAlert({ open: true, message: errorMessage });
    }
  };

  const processCollectionFile = async (file: File) => {
    try {
      const imageFiles =
        collectionType === CollectionType.COLLECTION
          ? await processCollectionZipFile(file)
          : await processCollectionZipFile(file, 1);
      setImageCollectionFile(imageFiles);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      let errorMessage =
        'There is a problem with your file. Please check and try again. ';
      if ((err as Error).message === ImageFileError.TOO_MANY_EXT) {
        errorMessage +=
          'Your file contain many different file extensions. Please note that one zip file can only include one file extension.';
      }
      if ((err as Error).message === ImageFileError.ONLY_ONE_FILE_ALLOWED) {
        errorMessage +=
          'Your zip file contain too many files. Please note that one zip file can only include one file.';
      }
      setShowErrorAlert({ open: true, message: errorMessage });
    }
  };

  const handleProccessFile = async (): Promise<void> => {
    if (!rawFile) return;

    if (collectionType === CollectionType.GENERATIVE) {
      await processGenerativeFile(rawFile);
    }

    if (
      [
        CollectionType.COLLECTION,
        CollectionType.EDITIONS,
        CollectionType.ONE,
      ].includes(collectionType)
    ) {
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
        return `File size error, maximum file size is ${SANDBOX_BTC_IMAGE_SIZE_LIMIT}KB.`;
      case ImageFileError.ONLY_ONE_FILE_ALLOWED:
        return `File size error, only one file is allowed.`;
      case ImageFileError.INVALID_EXTENSION:
        return `Invalid file format. Supported file extensions are ${getSupportedFileExtList().join(
          ', '
        )}.`;
      default:
        return '';
    }
  };

  const getIconByFileType = (fileMediaType: string | null): string => {
    switch (fileMediaType) {
      case MediaType.IMAGE:
        return `${CDN_URL}/icons/ic-image-24x24.svg`;
      case MediaType.MODEL_3D:
        return `${CDN_URL}/icons/ic-3d-24x24.svg`;
      case MediaType.VIDEO:
        return `${CDN_URL}/icons/ic-video-24x24.svg`;
      case MediaType.AUDIO:
        return `${CDN_URL}/icons/ic-audio-24x24.svg`;
      case MediaType.IFRAME:
        return `${CDN_URL}/icons/ic-html-24x24.svg`;
      default:
        return `${CDN_URL}/icons/ic-file-24x24.svg`;
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
                {fileList.map((fileItem, index) => {
                  const fileExt =
                    getFileExtensionByFileName(fileItem.name) ?? '';
                  const fileMediaType = getMediaTypeFromFileExt(fileExt);

                  return (
                    <li key={index} className={s.fileItem}>
                      <div className={s.fileInfo}>
                        <SvgInset
                          className={cs(s.codeIcon, {
                            [`codeIconError_${fileMediaType?.toLowerCase()}`]:
                              fileItem.error,
                          })}
                          size={24}
                          svgUrl={getIconByFileType(fileMediaType)}
                        />
                        <Text
                          as={'span'}
                          size={'18'}
                          color={cs('primary-color', {
                            [`${s.errorText}`]: !!fileItem.error,
                          })}
                          className={s.fileName}
                        >
                          {fileItem.name}{' '}
                          {`(${prettyPrintBytes(fileItem.size)})`}
                        </Text>
                      </div>
                      {fileItem.error && (
                        <p className={s.fileError}>
                          {getFileError(fileItem.error)}
                        </p>
                      )}
                    </li>
                  );
                })}
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
                onClick={() => {
                  setCollectionType(CollectionType.GENERATIVE);
                }}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.GENERATIVE,
                })}
              >
                Generative
                <span className={s.checkmark}></span>
              </div>
              <div
                onClick={() => {
                  setCollectionType(CollectionType.COLLECTION);
                }}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.COLLECTION,
                })}
              >
                File collection
                <span className={s.checkmark}></span>
              </div>
              <div
                onClick={() => {
                  setCollectionType(CollectionType.EDITIONS);
                }}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.EDITIONS,
                })}
              >
                Editions
                <span className={s.checkmark}></span>
              </div>
              <div
                onClick={() => {
                  setCollectionType(CollectionType.ONE);
                }}
                className={cs(s.choiceItem, {
                  [`${s.choiceItem__active}`]:
                    collectionType === CollectionType.ONE,
                })}
              >
                1/1
                <span className={s.checkmark}></span>
              </div>
            </div>
            <div className={s.guideWrapper}>
              <p>
                {collectionType === CollectionType.GENERATIVE && (
                  <>
                    New artist?&nbsp;
                    <Link
                      href={SOCIALS.docsForArtist}
                      target={'_blank'}
                      rel="noreferrer"
                    >
                      Start here.
                    </Link>
                  </>
                )}
                {collectionType === CollectionType.COLLECTION && (
                  <>
                    First time? Check the step-by-step instructions&nbsp;
                    <Link
                      href={SOCIALS.docsForArtist2}
                      target={'_blank'}
                      rel="noreferrer"
                    >
                      here.
                    </Link>
                  </>
                )}
                {collectionType === CollectionType.EDITIONS && (
                  <>Same artwork with numerous copies.</>
                )}
                {collectionType === CollectionType.ONE && (
                  <>An unique artwork. No copy.</>
                )}
              </p>
            </div>
          </div>
          <div className={s.dropZoneWrapper}>
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
            <p className={s.supportedFileText}>
              Supported file extensions are{' '}
              {`${getSupportedFileExtList().join(', ')}. `}
              <b>
                Please note that one zip file can only include one file
                extension.
              </b>
            </p>
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
          {[
            CollectionType.COLLECTION,
            CollectionType.EDITIONS,
            CollectionType.ONE,
          ].includes(collectionType) && renderUploadImageCollectionSuccess()}
        </>
      )}
    </section>
  );
};

export default UploadGenArt;
