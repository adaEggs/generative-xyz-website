import s from './styles.module.scss';
import cs from 'classnames';
import { FileUploader } from 'react-drag-drop-files';
import { useState } from 'react';
import { prettyPrintBytes } from '@utils/units';
import { SANDBOX_BTC_FILE_SIZE_LIMIT, CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

export interface IProps {
  className: string;
  acceptedFileType?: Array<string>;
  fileOrFiles?: File[] | null;
  labelText: string;
  maxSize: number;
  onChange: (files: File | null) => void;
}

const DropFile: React.FC<IProps> = ({
  acceptedFileType,
  fileOrFiles,
  className,
  labelText,
  maxSize,
  onChange,
}: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChangeFile = (file: File): void => {
    setFile(file);
    setError('');
    onChange(file);
  };

  const onSizeError = (): void => {
    setError(
      `File size error, maximum file size is ${SANDBOX_BTC_FILE_SIZE_LIMIT}kb.`
    );
  };

  const onTypeError = (): void => {
    setError('Invalid file extension.');
  };

  return (
    <div
      className={cs(s.dropFile, className, {
        [s.dropFile__drag]: false,
        [s.dropFile__error]: !!error,
      })}
    >
      <FileUploader
        handleChange={onChangeFile}
        name={'zipFileUploader'}
        maxSize={maxSize}
        minSize={0}
        types={acceptedFileType}
        onTypeError={onTypeError}
        onSizeError={onSizeError}
        fileOrFiles={fileOrFiles}
        classes={s.dropZone}
      >
        <div>
          <SvgInset
            size={100}
            className={s.dropZoneThumbnail}
            svgUrl={`${CDN_URL}/images/docs.svg`}
          ></SvgInset>
          {file ? (
            <p className={s.dropZoneDescription}>
              {`${file.name} (${prettyPrintBytes(file.size)})`}
            </p>
          ) : (
            <p className={s.dropZoneDescription}>{labelText}</p>
          )}
          {error && (
            <p className={cs(s.dropZoneDescription, s.errorText)}>{error}</p>
          )}
        </div>
      </FileUploader>
    </div>
  );
};

export default DropFile;
