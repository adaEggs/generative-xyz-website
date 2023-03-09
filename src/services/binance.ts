import { BINANCE_API_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { IGetExchangeRateResponse } from '@interfaces/api/binance';
import log from '@utils/logger';

const LOG_PREFIX = 'MempoolService';
//BTCUSDT

export const getExchangeRate = async (
  symbol: string
): Promise<IGetExchangeRateResponse> => {
  try {
    const res = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=${symbol}`);
    const data = await res.json();
    return data as IGetExchangeRateResponse;
  } catch (err: unknown) {
    log('failed to get mempool fee rate', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get fee rate');
  }
};
