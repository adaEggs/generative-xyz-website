import { API_BASE_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { useMemo, useState } from 'react';

const LOG_PREFIX = 'useChunkedFileUploader';
const API_PATH = `${API_BASE_URL}/files/multipart`;

// Upload chunked file
// 1 - Initiates a API multipart upload with a POST request.
// 2 - This initial request generates an upload ID for use in subsequent PUT requests to upload the data in parts
// 3 - and in the final POST request to complete the upload.

const useChunkedFileUploader = () => {
  const [chunkCount, setChunkCount] = useState(0);
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState<unknown | null>(null);

  const uploadProgress = useMemo(() => {
    if (!chunkCount) return 0;
    if (counter > chunkCount) {
      return 100;
    }
    return Math.round((counter / chunkCount) * 100);
  }, [chunkCount, counter]);

  const uploadFile = async (
    uploadId: string,
    file: File,
    chunkSize: number
  ) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    setChunkCount(totalChunks);
    setCounter(0);
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
          const partNumber = chunkIndex + 1;
          const xhr = new XMLHttpRequest();
          xhr.overrideMimeType('application/octet-stream');
          xhr.open(
            'PUT',
            `${API_PATH}/${uploadId}?partNumber=${partNumber}`,
            true
          );

          const promise = new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(xhr.response);
                setCounter(prev => prev + 1);
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
    } catch (error: unknown) {
      setError(error);
      setCounter(0);
      log('Upload chunk file error', LogLevel.ERROR, LOG_PREFIX);
      throw Error('Upload chunk file error');
    }
  };

  return { uploadFile, uploadProgress, error };
};

export default useChunkedFileUploader;
