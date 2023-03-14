import { MEMPOOL_API_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { IGetMempoolFeeRateResponse } from '@interfaces/api/mempool';
import log from '@utils/logger';

const LOG_PREFIX = 'MempoolService';

export const getMempoolFeeRate =
  async (): Promise<IGetMempoolFeeRateResponse> => {
    try {
      const res = await fetch(`${MEMPOOL_API_URL}/fees/recommended`);
      const data = await res.json();
      return data as IGetMempoolFeeRateResponse;
    } catch (err: unknown) {
      log('failed to get mempool fee rate', LogLevel.ERROR, LOG_PREFIX);
      throw Error('Failed to get fee rate');
    }
  };
