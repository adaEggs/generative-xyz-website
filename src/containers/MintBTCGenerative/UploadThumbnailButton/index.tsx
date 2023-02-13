import s from './styles.module.scss';
import { prettyPrintBytes } from '@utils/units';
import React, { useContext, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import Image from 'next/image';
import { CDN_URL } from '@constants/config';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';

const UploadThumbnailButton: React.FC = () => {
  const { thumbnailFile, setThumbnailFile } = useContext(
    MintBTCGenerativeContext
  );
  const [error, setError] = useState<string | null>(null);

  const onChangeFile = (file: File): void => {
    setThumbnailFile(file);
    setError('');
  };

  const onSizeError = (): void => {
    setError('File size error, maximum file size is 500kb.');
  };

  const onTypeError = (): void => {
    setError(
      'Invalid file, supported file extensions are JPG, JPEG, PNG, GIF.'
    );
  };

  return (
    <div className={s.uploadThumbnail}>
      <FileUploader
        handleChange={onChangeFile}
        name={'thumbnailUploader'}
        maxSize={0.5}
        minSize={0}
        types={['JPG', 'JPEG', 'PNG', 'GIF']}
        onSizeError={onSizeError}
        onTypeError={onTypeError}
        fileOrFiles={thumbnailFile}
        classes={s.uploadThumbnailBtn}
      >
        <Image
          alt="upload icon"
          height={16}
          width={16}
          src={`${CDN_URL}/icons/ic-upload-image-16x16.svg`}
        />
        <span className={s.fileName}>
          {thumbnailFile
            ? `${thumbnailFile.name} (${prettyPrintBytes(thumbnailFile.size)})`
            : 'Upload thumbnail'}
        </span>
        <sup className={s.requiredTag}>*</sup>
      </FileUploader>
      {error && <p className={s.errorText}>{error}</p>}
    </div>
  );
};

export default UploadThumbnailButton;
