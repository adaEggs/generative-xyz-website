import { LogLevel } from '@enums/log-level';
import {
  ICompleteMultipartUploadPayload,
  ICompleteMultipartUploadResponse,
  IInitiateMultipartUploadPayload,
  IInitiateMultipartUploadResponse,
  IMinifyFilePayload,
  IMinifyFileResponse,
  IUploadFilePayload,
  IUploadFileResponse,
} from '@interfaces/api/files';
import { post, postFile } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'FilesService';

const API_PATH = '/files';

export const uploadFile = async (
  payload: IUploadFilePayload
): Promise<IUploadFileResponse> => {
  try {
    const res = await postFile<IUploadFilePayload, IUploadFileResponse>(
      `${API_PATH}`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to upload file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to upload file');
  }
};

export const minifyFile = async (
  payload: IMinifyFilePayload
): Promise<IMinifyFileResponse> => {
  try {
    const res = await post<IMinifyFilePayload, IMinifyFileResponse>(
      `${API_PATH}/minify`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to minify file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to minify file');
  }
};

export const initiateMultipartUpload = async (
  payload: IInitiateMultipartUploadPayload
): Promise<IInitiateMultipartUploadResponse> => {
  try {
    const res = await post<
      IInitiateMultipartUploadPayload,
      IInitiateMultipartUploadResponse
    >(`${API_PATH}/multipart`, {
      group: 'generative-project-upload',
      ...payload,
    });
    return res;
  } catch (err: unknown) {
    log('failed to initiate multipart upload file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to initiate multipart upload file');
  }
};

export const completeMultipartUpload = async (
  payload: ICompleteMultipartUploadPayload
): Promise<ICompleteMultipartUploadResponse> => {
  try {
    const { uploadId } = payload;
    const res = await post<unknown, ICompleteMultipartUploadResponse>(
      `${API_PATH}/multipart/${uploadId}`,
      {}
    );
    return res;
  } catch (err: unknown) {
    log('failed to complete multipart upload file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to complete multipart upload file');
  }
};
