import { API_BASE_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import {
  IUploadCollectionTemplatePayload,
  IUploadCollectionTemplateResponse,
} from '@interfaces/api/ordinal';
import log from '@utils/logger';
import { postFile } from './http-client';

const LOG_PREFIX = 'OrdinalService';
const API_PATH = '/ordinal/collections';

export const ordinalCollectionTemplateURL = `${API_BASE_URL}${API_PATH}/template`;

export const uploadOrdinalCollectionTemplate = async (
  payload: IUploadCollectionTemplatePayload
): Promise<IUploadCollectionTemplateResponse> => {
  try {
    const res = await postFile<
      IUploadCollectionTemplatePayload,
      IUploadCollectionTemplateResponse
    >(API_PATH, payload);
    return res;
  } catch (err: unknown) {
    log('failed to upload collection template', LogLevel.ERROR, LOG_PREFIX);
    log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};
