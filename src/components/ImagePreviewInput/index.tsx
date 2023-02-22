import Skeleton from '@components/Skeleton';
import cs from 'classnames';
import Image from 'next/image';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import s from './styles.module.scss';
import { prettyPrintBytes } from '@utils/units';

interface IProps {
  file: string;
  onFileChange: Dispatch<SetStateAction<File | null | undefined>>;
  className?: string;
  placeHolderHtml?: JSX.Element;
  previewHtml?: JSX.Element;
  maxSizeKb?: number;
}

const ImagePreviewInput: React.FC<IProps> = ({
  file,
  className,
  placeHolderHtml,
  onFileChange,
  previewHtml,
  maxSizeKb = 1024,
}: IProps): React.ReactElement => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<JSX.Element | null>(
    previewHtml || null
  );

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    setPreview(file);
    return () => URL.revokeObjectURL(file);
  }, [file]);

  const onSelectFile = (evt: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!evt.target.files || evt.target.files.length === 0) {
      setCurrentImage(previewHtml || null);
      return;
    }

    const newFile = evt.target.files[0];
    const fileSize = newFile.size / 1024;

    setPreview(URL.createObjectURL(newFile));
    setCurrentImage(null);

    if (fileSize > maxSizeKb) {
      onFileChange(null);
      setError(
        `File size error, maximum file size is ${prettyPrintBytes(
          maxSizeKb * 1024
        )}.`
      );
    } else {
      onFileChange(newFile);
    }
  };

  return (
    <div className={cs(s.imagePreviewInput, className)}>
      <label htmlFor="fileInput">
        <>
          {preview ? (
            <>
              {currentImage ? (
                previewHtml
              ) : (
                <div className={s.previewWrapper}>
                  <Image
                    className={s.previewImage}
                    fill
                    src={preview}
                    alt="preview image"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {placeHolderHtml ? placeHolderHtml : <Skeleton fill></Skeleton>}
            </>
          )}
        </>
      </label>
      <input
        id="fileInput"
        className={s.fileInput}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
      />

      {error && <p className={s.errorText}>{error}</p>}
    </div>
  );
};
export default ImagePreviewInput;
