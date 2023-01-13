import s from './styles.module.scss';
import Button from '@components/ButtonIcon';
import DropFile from '@containers/MintGenerative/DropFile';
import { MintGenerativeContext } from '@contexts/mint-generative-context';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { detectUsedLibs, processSandboxZipFile } from '@utils/sandbox';
import { prettyPrintBytes } from '@utils/units';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Image from 'next/image';
import Checkbox from '@components/Checkbox';
import { useRouter } from 'next/router';
import { MintGenerativeStep } from '@enums/mint-generative';
import { SandboxFileError } from '@enums/sandbox';
import Text from '@components/Text';
import Heading from '@components/Heading';
import { SOCIALS } from '@constants/common';

const LOG_PREFIX = 'UploadGenArt';

const UploadGenArt: React.FC = (): ReactElement => {
  const router = useRouter();
  const [isProjectWork, setIsProjectWork] = useState(true);
  const {
    attributes,
    formValues,
    filesSandbox,
    setFilesSandbox,
    zipFile,
    setZipFile,
    setShowErrorAlert,
    setFormValues,
  } = useContext(MintGenerativeContext);

  const handleChangeIsProjectWork = (): void => {
    setIsProjectWork(!isProjectWork);
  };

  const processFile = async (file: File) => {
    try {
      const sandboxFiles = await processSandboxZipFile(file);
      setFilesSandbox(sandboxFiles);

      const detectedLibs = await detectUsedLibs(sandboxFiles);
      setFormValues({
        ...formValues,
        thirdPartyScripts: detectedLibs,
      });
    } catch (err: unknown) {
      log(err as Error, LogLevel.Error, LOG_PREFIX);
      let errorMessage =
        'There is a problem with your zip file. Please check and try again. ';
      if ((err as Error).message === SandboxFileError.NO_INDEX_HTML) {
        errorMessage += 'index.html is not found.';
      }
      if (
        (err as Error).message === SandboxFileError.NO_SNIPPET_CONTRACT ||
        (err as Error).message === SandboxFileError.NO_SNIPPET_RANDOM
      ) {
        errorMessage += 'Snippet code is not found.';
      }
      if ((err as Error).message === SandboxFileError.WRONG_FORMAT) {
        errorMessage += 'Invalid file format.';
      }
      setShowErrorAlert({ open: true, message: errorMessage });
    }
  };

  const handleProccessFile = (): void => {
    if (zipFile) {
      processFile(zipFile);
    }
  };

  const handleChangeFile = (files: File[] | null): void => {
    setZipFile(files && files.length > 0 ? files[0] : null);
  };

  const handleGoToNextStep = (): void => {
    router.push(
      `/mint-generative/${MintGenerativeStep.PROJECT_DETAIL}`,
      undefined,
      { shallow: true }
    );
  };

  const handleReupload = (): void => {
    setZipFile(null);
    setFilesSandbox(null);
  };

  const fileList = useMemo<string[] | null>(
    () => (filesSandbox ? Object.keys(filesSandbox) : null),
    [filesSandbox]
  );

  const renderUploadSuccess = () => {
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
                  fontWeight={'semibold'}
                  color={'primary-color'}
                  className={s.zipFileName}
                >
                  {zipFile?.name} ({prettyPrintBytes(zipFile?.size || 0)})
                </Heading>
              </div>
              <ul className={s.zipFileList}>
                {fileList?.map((fileName: string) => (
                  <li key={fileName} className={s.fileItem}>
                    <Image
                      className={s.codeIcon}
                      alt="folder icon"
                      width={18}
                      height={18}
                      src={`${CDN_URL}/icons/ic-code-18x18.svg`}
                    />
                    <Text
                      as={'span'}
                      size={'18'}
                      color={'primary-color'}
                      className={s.fileName}
                    >
                      {fileName}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.actionWrapper}>
              <Button sizes="small" variants="outline" onClick={handleReupload}>
                Update zip file
              </Button>
            </div>
          </div>
          <div className={s.projectAttributeWrapper}>
            <Heading as={'h5'} className={s.attrTitle} fontWeight={'semibold'}>
              Properties of the current variation
            </Heading>

            {attributes ? (
              <>
                <Text
                  as="p"
                  size={'16'}
                  fontWeight={'regular'}
                  className={s.attrDescription}
                  color={'black-60'}
                >
                  These properties will change for each variation
                </Text>
                <div className={s.attrList}>
                  {Object.entries(attributes).map(([key, value]) => {
                    return (
                      <div key={key} className={s.attrItem}>
                        <Text
                          as={'span'}
                          size="16"
                          fontWeight={'semibold'}
                          className={s.attrKey}
                        >
                          {key}:
                        </Text>
                        <Text
                          as={'span'}
                          color={'black-60'}
                          size={'16'}
                          className={s.attrValue}
                        >
                          {value}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <Text as="p" fontWeight="regular" size="16" color={'black-60'}>
                There is no properties defined.
              </Text>
            )}
          </div>
          <div className={s.container}>
            <div className={s.checkboxWrapper}>
              <Checkbox
                checked={isProjectWork}
                onClick={handleChangeIsProjectWork}
                className={s.checkbox}
                id="workProperly"
                label="My NFT collection is ready to go!"
              />
            </div>
            <div className={s.actionWrapper}>
              <Button
                disabled={!isProjectWork || !filesSandbox}
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
          <Text as={'p'} className={s.linkDocs} size={'16'} color={'black-60'}>
            New artist?&nbsp;
            <a href={SOCIALS.docsForArtist} target={'_blank'} rel="noreferrer">
              Start here.
            </a>
          </Text>
          <div className={s.dropZoneWrapper}>
            <DropFile
              className={s.dropZoneContainer}
              acceptedFileType={{
                'application/zip': ['.zip'],
                'application/x-zip-compressed': ['.zip'],
              }}
              onChange={handleChangeFile}
              files={zipFile ? [zipFile] : null}
            />
          </div>
        </div>
        {/*<div className={s.disclaimerWrapper}>*/}
        {/*  <Text fontWeight="semibold" className={s.disclaimer}>*/}
        {/*    This is a space in which you can drop a .zip of your project and see*/}
        {/*    how it would behave when it will be minted on Generative. If your*/}
        {/*    artwork does not behave properly in the setup thumbnail image are,*/}
        {/*    it will not work after being minted. If you are new to the platform*/}
        {/*    please read our&nbsp;*/}
        {/*    <Link*/}
        {/*      className={s.link}*/}
        {/*      href={EXTERNAL_LINK.DOCS}*/}
        {/*      target="_blank"*/}
        {/*      rel="noopener"*/}
        {/*    >*/}
        {/*      Guide to launch your NFT collection.*/}
        {/*    </Link>*/}
        {/*  </Text>*/}
        {/*  <Text fontWeight="medium" className={s.disclaimer}>*/}
        {/*    Please make sure that your project follows our&nbsp;*/}
        {/*    <Link*/}
        {/*      className={s.link}*/}
        {/*      href={EXTERNAL_LINK.GUIDE}*/}
        {/*      target="_blank"*/}
        {/*      rel="noopener"*/}
        {/*    >*/}
        {/*      Code of Conduct.*/}
        {/*    </Link>*/}
        {/*  </Text>*/}
        {/*</div>*/}
      </>
    ),
    [zipFile]
  );

  useEffect(() => {
    handleProccessFile();
  }, [zipFile]);

  return (
    <section className={s.uploadGenArt}>
      {filesSandbox ? renderUploadSuccess() : renderUpload}
    </section>
  );
};

export default UploadGenArt;
