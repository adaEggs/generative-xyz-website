import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import {
  ITrackTx,
  ICollectedUTXOResp,
  IFeeRate,
  ITxHistory,
} from '@interfaces/api/bitcoin';
import axios from 'axios';

const LOG_PREFIX = 'COLLECTED_NFT';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string
): Promise<ICollectedUTXOResp> => {
  try {
    const res = await get<ICollectedUTXOResp>(
      `/wallet/wallet-info?address=${btcAddress}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const getFeeRate = async (): Promise<IFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    return res.json();
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const trackTx = async (payload: ITrackTx): Promise<never> => {
  try {
    const res = await post<ITrackTx, never>(`/wallet/track-tx`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const getHistory = async (address: string): Promise<ITxHistory[]> => {
  try {
    const res = await get<ITxHistory[]>(
      `/wallet/txs?address=${address}&limit=100&offset=0`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const broadcastTx = async (txHex: string): Promise<never> => {
  try {
    return axios.post(`https://blockstream.info/api/tx`, txHex);
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};
