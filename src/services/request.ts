import { LogLevel } from '@enums/log-level';
import qs from 'query-string';

import {
  IGetDaoProjectsPayload,
  IGetDaoProjectsResponse,
  IGetDaoArtistsPayload,
  IGetDaoArtistsResponse,
  IPutDaoProjectResponse,
  IPutDaoArtistResponse,
  IPostDaoArtistResponse,
} from '@interfaces/api/request';
import { get, put, post } from '@services/http-client';
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

export const voteDaoProject = async (
  projectId: string,
  voteType: number
): Promise<IPutDaoProjectResponse> => {
  try {
    return await put(`${API_PATH}project/${projectId}`, {
      status: voteType,
    });
  } catch (err: unknown) {
    log(`failed to put dao project`, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get dao project');
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
      `failed to get dao artists with query string: ${queryString}}`,
      LogLevel.ERROR,
      LOG_PREFIX
    );
    throw Error('Failed to get dao artists');
  }
};

export const voteDaoArtist = async (
  projectId: string,
  voteType: number
): Promise<IPutDaoArtistResponse> => {
  try {
    return await put(`${API_PATH}artist/${projectId}`, {
      status: voteType,
    });
  } catch (err: unknown) {
    log(`failed to put dao artist`, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to put dao artist');
  }
};

export const createDaoArtist = async (
  twitter: string,
  web: string
): Promise<IPostDaoArtistResponse> => {
  try {
    return await post(`${API_PATH}artist`, { twitter, web });
  } catch (err: unknown) {
    log(`failed to post dao artist`, LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to post dao artist');
  }
};
