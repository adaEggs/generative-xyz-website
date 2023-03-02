/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel } from '@enums/log-level';
import { BareFetcher, unstable_serialize } from 'swr';

import { IGetSearchPayload, IGetSearchResponse } from '@interfaces/api/search';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'SearchService';
const API_PATH = '/search';

export const getSearchByKeyword = async ({
  page,
  limit,
  keyword,
  type,
}: IGetSearchPayload): Promise<IGetSearchResponse> => {
  try {
    return await get<IGetSearchResponse>(
      `${API_PATH}?page=${page}&limit=${limit}&search=${keyword}&type=${type}`
    );
  } catch (err: unknown) {
    log('failed to get search', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get search');
  }
};

export const reorderKeys = (obj = {} as any) => {
  const newObj = {} as any;
  Object.keys(obj)
    .sort()
    .forEach(key => {
      newObj[key] = obj[key];
    });
  return newObj;
};

export const getApiKey = (
  fetcher: BareFetcher,
  params?: string | Record<string, unknown>
): string => {
  return unstable_serialize([
    fetcher.name,
    typeof params === 'string' ? params : reorderKeys(params),
  ]);
};
