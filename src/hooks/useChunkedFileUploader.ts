import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { useState } from 'react';

const LOG_PREFIX = 'useChunkedFileUploader';

const useChunkedFileUploader = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    chunkSize: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onProgress: (progress: number) => any
  ) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadPromises = [];
    const maxRetries = 3;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('file', chunk, file.name);

      let retries = 0;
      let success = false;

      while (retries <= maxRetries && !success) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/upload', true);

          const promise = new Promise((resolve, reject) => {
            xhr.upload.onprogress = event => {
              const progress = (start + event.loaded) / file.size;
              setUploadProgress(progress);
              onProgress && onProgress(progress);
            };

            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(xhr.response);
              } else {
                reject(xhr.statusText);
              }
            };

            xhr.onerror = () => {
              reject(xhr.statusText);
            };

            xhr.send(formData);
          });

          uploadPromises.push(promise);
          success = true;
        } catch (error) {
          log(`Upload failed, retrying...${error}`, LogLevel.ERROR, LOG_PREFIX);
          retries++;
        }
      }

      if (!success) {
        log(
          `Upload failed after ${maxRetries} retries`,
          LogLevel.ERROR,
          LOG_PREFIX
        );
        return;
      }
    }

    try {
      await Promise.all(uploadPromises);
      setUploadProgress(1);
    } catch (error) {
      log('Upload failed', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  return { uploadFile, uploadProgress };
};

export default useChunkedFileUploader;
