import { GN_API_BASE_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { IGetProductListResponse } from '@interfaces/api/product';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'ProductService';

const API_PATH = '/v1/product';

export const getProductList = async (): Promise<IGetProductListResponse> => {
  try {
    const res = await get<IGetProductListResponse>(`${API_PATH}/list`, {
      baseUrl: GN_API_BASE_URL,
    });
    return res;
  } catch (err: unknown) {
    log('failed to get product list', LogLevel.Error, LOG_PREFIX);
    throw Error('Failed to get product list');
  }
};
