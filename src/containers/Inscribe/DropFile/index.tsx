import s from './styles.module.scss';
import cs from 'classnames';
import { FileUploader } from 'react-drag-drop-files';
import { useState } from 'react';
import { prettyPrintBytes } from '@utils/units';
import { MINT_TOOL_MAX_FILE_SIZE } from '@constants/config';

export interface IProps {
  className: string;
  fileOrFiles?: File[] | null;
  onChange: (files: File | null) => void;
}

const DropFile: React.FC<IProps> = ({
  fileOrFiles,
  className,
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
      `File size error, maximum file size is ${MINT_TOOL_MAX_FILE_SIZE}MB`
    );
  };

  const onTypeError = (): void => {
    setError('Invalid file extension. Please check and try again.');
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
        name={'fileUploader'}
        maxSize={MINT_TOOL_MAX_FILE_SIZE}
        minSize={0}
        onSizeError={onSizeError}
        onTypeError={onTypeError}
        fileOrFiles={fileOrFiles}
        classes={s.dropZone}
      >
        <div>
          {file ? (
            <p className={s.dropZoneDescription}>
              {`${file.name} (${prettyPrintBytes(file.size)})`}
            </p>
          ) : (
            <p className={s.dropZoneDescription}>
              Drag and drop image or text file here, or click to select file
            </p>
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
