import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import {
  ITrackTx,
  ICollectedUTXOResp,
  IFeeRate,
  ITxHistory,
  HistoryStatusType,
  HistoryStatusColor,
} from '@interfaces/api/bitcoin';
import axios from 'axios';
import { getPendingUTXOs } from '@containers/Profile/ButtonSendBTC/storage';
import { getUTXOKey } from '@containers/Profile/ButtonSendBTC/utils';
import { isExpiredTime } from '@utils/time';

const LOG_PREFIX = 'COLLECTED_NFT';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string
): Promise<ICollectedUTXOResp> => {
  try {
    const res = await get<ICollectedUTXOResp>(
      `/wallet/wallet-info?address=${btcAddress}`
    );

    const pendingUTXOs = getPendingUTXOs();
    const data = {
      ...res,
      txrefs: res.txrefs.filter(item => {
        const txIDKey = getUTXOKey(item);
        const isPending = pendingUTXOs.some(tx => tx.txIDKey === txIDKey);
        return !isPending;
      }),
    };
    return data;
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
    return (res || []).map(history => {
      let statusColor: HistoryStatusColor = '#ff7e21';
      let status: HistoryStatusType = HistoryStatusType.pending;
      const isExpired = isExpiredTime({
        time: history.created_at,
        expiredMin: 4,
      });
      if (isExpired) {
        status = history.status;
        switch (status) {
          case HistoryStatusType.pending:
            statusColor = '#ff7e21';
            break;
          case HistoryStatusType.success:
            statusColor = '#24c087';
            break;
          case HistoryStatusType.failed:
            statusColor = '#ff4747';
            break;
        }
      }
      return {
        ...history,
        statusColor,
        status,
      };
    });
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
