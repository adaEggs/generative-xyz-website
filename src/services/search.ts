/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel } from '@enums/log-level';
import qs from 'query-string';

import { IGetSearchPayload, IGetSearchResponse } from '@interfaces/api/search';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'SearchService';
const API_PATH = '/search';

export const getSearchByKeyword = async (
  params: IGetSearchPayload
): Promise<IGetSearchResponse> => {
  try {
    const queryString = qs.stringify({
      limit: params.limit,
      page: params.page,
      search: params.keyword,
      type: params.type,
    });
    return await get<IGetSearchResponse>(`${API_PATH}?${queryString}`);
  } catch (err: unknown) {
    log('failed to get search', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get search');
  }
};
