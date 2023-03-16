import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import {
  ordinalCollectionTemplateURL,
  uploadOrdinalCollectionTemplate,
} from '@services/ordinal';
import log from '@utils/logger';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import DropFile from './DropFile';
import s from './styles.module.scss';

const LOG_PREFIX = 'ListCollectionModal';

interface IProps {
  handleClose: () => void;
}

const ListCollectionModal: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { handleClose } = props;
  const [file, setFile] = useState<null | File>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOnChangeFile = (newFile: File | null): void => {
    setFile(newFile);
  };

  const handleSubmit = async (): Promise<void> => {
    setErrMsg(null);

    if (!file) {
      setErrMsg('File is required.');
      return;
    }

    try {
      setIsProcessing(true);
      await uploadOrdinalCollectionTemplate({
        file,
      });

      toast.success('Listed collection successfully.');
      handleClose();
    } catch (err: unknown) {
      log('failed to upload zip file', LogLevel.ERROR, LOG_PREFIX);
      toast.error((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={s.listCollectionModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalHeader}>
            <Button
              onClick={handleClose}
              className={s.closeBtn}
              variants="ghost"
              type="button"
            >
              <SvgInset
                className={s.closeIcon}
                svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
              />
            </Button>
          </div>
          <div className={s.modalBody}>
            <h1 className={s.modalTitle}>List a collection</h1>
            <p className={s.guideText}>
              Download the template{' '}
              <Link download href={ordinalCollectionTemplateURL}>
                here
              </Link>{' '}
              and edit your JSON files as instructed. Zip them and upload the
              zipped file.
            </p>
            <div className={s.dropFileWrapper}>
              <DropFile
                fileOrFiles={file ? [file] : null}
                onChange={handleOnChangeFile}
                className={s.dropFileContainer}
              />
            </div>
            <Button
              disabled={isProcessing}
              className={s.submitBtn}
              onClick={handleSubmit}
            >
              {isProcessing ? 'Processing...' : 'Submit'}
            </Button>
            {errMsg && <p className={s.errorMessage}>{errMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCollectionModal;
