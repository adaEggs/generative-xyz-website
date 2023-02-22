import { LogLevel } from '@enums/log-level';
import { IGetArtistsResponse } from '@interfaces/api/user';
import { get } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'UserService';

const API_PATH = '/user';

export const getArtists = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<IGetArtistsResponse> => {
  try {
    return await get<IGetArtistsResponse>(
      `${API_PATH}/artist?page=${page}&limit=${limit}`
    );
  } catch (err: unknown) {
    log('failed to get artists', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get artists');
  }
};

export const getUsers = async ({
  limit = 20,
  page = 1,
  search = '',
}: {
  limit?: number;
  page?: number;
  search?: string;
}): Promise<IGetArtistsResponse> => {
  try {
    return await get<IGetArtistsResponse>(
      `${API_PATH}?search=${search}&page=${page}&limit=${limit}`
    );
  } catch (err: unknown) {
    log('failed to get user list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get user list');
  }
};
