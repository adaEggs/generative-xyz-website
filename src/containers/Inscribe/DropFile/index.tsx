import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL, MINT_TOOL_MAX_FILE_SIZE } from '@constants/config';
import { isInscribeImageFile } from '@utils/file';
import { prettyPrintBytes } from '@utils/units';
import cs from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import s from './styles.module.scss';

export interface IProps {
  className: string;
  fileOrFiles: File[] | null;
  onChange: (files: File | null) => void;
  setFileError: React.Dispatch<React.SetStateAction<string | null>>;
}

// apng asc flac gif glb html jpg json mp3 mp4 pdf png stl svg txt wav webm webp yaml
const fileTypes = [
  'APNG',
  'ASC',
  'FLAC',
  'GIF',
  'GLB',
  'HTML',
  'JPG',
  'JSON',
  'MP3',
  'MP4',
  'PDF',
  'PNG',
  'STL',
  'SVG',
  'TXT',
  'WAV',
  'WEBM',
  'WEBP',
  'YAML',
];

const DropFile: React.FC<IProps> = ({
  fileOrFiles,
  className,
  onChange,
  setFileError,
}: IProps) => {
  const [file, setFile] = useState<File | null>(
    fileOrFiles?.length ? fileOrFiles[0] : null
  );
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onChangeFile = (file: File): void => {
    setFile(file);
    setError('');
    setFileError('');
    onChange(file);
  };

  const onSizeError = (): void => {
    setError(
      `File size error, maximum file size is ${
        MINT_TOOL_MAX_FILE_SIZE * 1000
      }KB.`
    );
    setFileError(
      `File size error, maximum file size is ${
        MINT_TOOL_MAX_FILE_SIZE * 1000
      }KB.`
    );
    setPreview(null);
  };

  const onTypeError = (): void => {
    setError('Invalid file extension. Please check and try again.');
    setFileError('Invalid file extension. Please check and try again.');
    setPreview(null);
  };

  useEffect(() => {
    if (file && isInscribeImageFile(file)) {
      setPreview(URL.createObjectURL(file));
    } else {
      onTypeError();
    }
  }, [file]);

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
        types={fileTypes}
      >
        <>
          {file ? (
            <div className={s.wrapper}>
              {preview ? (
                <div className={s.thumbnailWrapper}>
                  <Image fill src={preview} alt="preview" />
                </div>
              ) : (
                <p className={s.dropZoneSize}>
                  {`${file.name} (${prettyPrintBytes(file.size)})`}
                </p>
              )}
              <div className={s.hoverUpload}>
                <div className={s.hoverContext}>
                  <SvgInset
                    size={48}
                    svgUrl={`${CDN_URL}/icons/ic-camera.svg`}
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
        </>
      </FileUploader>
    </div>
  );
};

export default DropFile;
