import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL, LIST_COLLECTION_MAX_FILE_SIZE } from '@constants/config';
import { prettyPrintBytes } from '@utils/units';
import cs from 'classnames';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import s from './styles.module.scss';

export interface IProps {
  className: string;
  fileOrFiles: File[] | null;
  onChange: (files: File | null) => void;
}

// apng asc flac gif glb html jpg json mp3 mp4 pdf png stl svg txt wav webm webp yaml
const fileTypes = ['ZIP'];

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
      `File size error, maximum file size is ${LIST_COLLECTION_MAX_FILE_SIZE}MB.`
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
        onSizeError={onSizeError}
        onTypeError={onTypeError}
        fileOrFiles={fileOrFiles}
        classes={s.dropZone}
        types={fileTypes}
      >
        <>
          {file ? (
            <div className={s.wrapper}>
              <p className={s.dropZoneSize}>
                {`${file.name} (${prettyPrintBytes(file.size)})`}
              </p>
              <div className={s.hoverUpload}>
                <div className={s.hoverContext}>
                  <SvgInset
                    size={48}
                    svgUrl={`${CDN_URL}/icons/ic-file-attach-24x24.svg`}
                  />
                  <Text size="18" fontWeight="medium">
                    Click to change a file
                  </Text>
                </div>
              </div>
            </div>
          ) : (
            <div className={s.wrap_loader}>
              <SvgInset
                size={80}
                className={s.dropZoneThumbnail}
                svgUrl={`${CDN_URL}/images/docs.svg`}
              />
              <div className={s.dropZoneWrapDescription}>
                <p className={s.dropZoneDescription}>Select a zip file</p>
              </div>
            </div>
          )}
          {error && (
            <p className={cs(s.dropZoneDescription, s.errorText)}>{error}</p>
          )}
        </>
      </FileUploader>
    </div>
  );
};

export default DropFile;
