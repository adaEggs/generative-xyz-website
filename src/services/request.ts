import { LogLevel } from '@enums/log-level';
import qs from 'query-string';

import {
  IGetDaoProjectsPayload,
  IGetDaoProjectsResponse,
  IGetDaoArtistsPayload,
  IGetDaoArtistsResponse,
} from '@interfaces/api/request';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'DaoRequestService';
const API_PATH = '/dao-';

export const getDaoProjects = async (
  params: IGetDaoProjectsPayload
): Promise<IGetDaoProjectsResponse> => {
  const queryString = qs.stringify(params);
  try {
    return await get<IGetDaoProjectsResponse>(
      `${API_PATH}project?${queryString}`
    );
  } catch (err: unknown) {
    log(
      `failed to get dao projects with query string: ${queryString}}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    throw Error('Failed to get dao projects');
  }
};

export const getDaoArtists = async (
  params: IGetDaoArtistsPayload
): Promise<IGetDaoArtistsResponse> => {
  const queryString = qs.stringify(params);
  try {
    return await get<IGetDaoArtistsResponse>(
      `${API_PATH}artist?${queryString}`
    );
  } catch (err: unknown) {
    log(
      `failed to get dao projects with query string: ${queryString}}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    throw Error('Failed to get dao projects');
  }
};
