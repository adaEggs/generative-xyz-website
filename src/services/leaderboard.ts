import { LogLevel } from '@enums/log-level';
import { get } from '@services/http-client';
import log from '@utils/logger';
import { IGetLeaderboardUserListResponse } from '@interfaces/api/leaderboard';

const LOG_PREFIX = 'LeaderboardService';

const API_PATH = '/leaderboard';

export const getLeaderboardUserList =
  async (): Promise<IGetLeaderboardUserListResponse> => {
    try {
      const res = await get<IGetLeaderboardUserListResponse>(`${API_PATH}`);
      return res;
    } catch (err: unknown) {
      log('failed to get leader board user list', LogLevel.Error, LOG_PREFIX);
      throw Error('Failed to get leader board user list');
    }
  };
