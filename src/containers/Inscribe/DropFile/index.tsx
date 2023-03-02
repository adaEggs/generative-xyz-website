import s from './styles.module.scss';
import cs from 'classnames';
import { FileUploader } from 'react-drag-drop-files';
import { useEffect, useState } from 'react';
import { prettyPrintBytes } from '@utils/units';
import { CDN_URL, MINT_TOOL_MAX_FILE_SIZE } from '@constants/config';
import SvgInset from '@components/SvgInset';

export interface IProps {
  className: string;
  fileOrFiles: File[] | null;
  onChange: (files: File | null) => void;
}

const DropFile: React.FC<IProps> = ({
  fileOrFiles,
  className,
  onChange,
}: IProps) => {
  const [file, setFile] = useState<File | null>(
    fileOrFiles?.length ? fileOrFiles[0] : null
  );
  const [error, setError] = useState<string | null>(null);

  const onChangeFile = (file: File): void => {
    setFile(file);
    setError('');
    onChange(file);
  };

  const onSizeError = (): void => {
    setError(
      `File size error, maximum file size is ${MINT_TOOL_MAX_FILE_SIZE}MB.`
    );
  };

  const onTypeError = (): void => {
    setError('Invalid file extension. Please check and try again.');
  };

  useEffect(() => {
    setFile(fileOrFiles?.length ? fileOrFiles[0] : null);
  }, [fileOrFiles]);

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
        onSizeError={onSizeError}
        onTypeError={onTypeError}
        fileOrFiles={fileOrFiles}
        classes={s.dropZone}
      >
        <div>
          {file ? (
            <p className={s.dropZoneSize}>
              {`${file.name} (${prettyPrintBytes(file.size)})`}
            </p>
          ) : (
            <div className={s.wrap_loader}>
              <SvgInset
                size={80}
                className={s.dropZoneThumbnail}
                svgUrl={`${CDN_URL}/images/docs.svg`}
              />
              <div className={s.dropZoneWrapDescription}>
                <p className={s.dropZoneDescription}>
                  Select a file to inscribe
                </p>
                <p className={s.dropZoneDescription}>(text, jpg, mp3, etc.)</p>
              </div>
            </div>
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
