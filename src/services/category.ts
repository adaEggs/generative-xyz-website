import { LogLevel } from '@enums/log-level';
import { IGetCategoryListResponse } from '@interfaces/api/category';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'CategoryService';

const API_PATH = '/categories';

export const getCategoryList = async (): Promise<IGetCategoryListResponse> => {
  try {
    const res = await get<IGetCategoryListResponse>(`${API_PATH}`);
    return res;
  } catch (err: unknown) {
    log('failed to get category list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get category list');
  }
};
