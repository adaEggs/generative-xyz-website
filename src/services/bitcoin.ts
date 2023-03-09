import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import {
  HistoryStatusColor,
  HistoryStatusType,
  ICollectedUTXOResp,
  IFeeRate,
  IListingPayload,
  IRetrieveOrderPayload,
  IRetrieveOrderResp,
  ITrackTx,
  ITxHistory,
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
    const txs = await get<ITxHistory[]>(
      `/wallet/txs?address=${address}&limit=30&offset=0`
    );
    // const res = await get<ITxHistory[]>(`/dex/history`);
    // const history = res.filter(
    //   item => !(txs || []).some(_item => _item.txhash === item.txhash)
    // );
    return (txs || []).map(history => {
      let statusColor: HistoryStatusColor = '#ff7e21';
      let status: HistoryStatusType = HistoryStatusType.pending;
      const now = new Date().getTime();
      const isExpired = isExpiredTime({
        time: history.created_at || now,
        expiredMin: 4,
      });
      if (isExpired) {
        status = history.status;
        switch (status) {
          case HistoryStatusType.cancelled:
          case HistoryStatusType.pending:
          case HistoryStatusType.cancelling:
          case HistoryStatusType.listing:
            statusColor = '#ff7e21';
            break;
          case HistoryStatusType.matched:
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
        isExpired,
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

export const submitListForSale = async (
  payload: IListingPayload
): Promise<never> => {
  try {
    return post<IListingPayload, never>(`/dex/listing`, payload);
  } catch (err: unknown) {
    log('failed to post submit list for sale', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const retrieveOrder = async (
  payload: IRetrieveOrderPayload
): Promise<IRetrieveOrderResp> => {
  try {
    const res = await get<IRetrieveOrderResp>(
      `/dex/retrieve-order?order_id=${payload?.orderID}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get retrieve order', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const submitCancel = async (payload: {
  txhash: string;
  inscription_id: string;
  order_id: string;
}): Promise<never> => {
  try {
    const res = await post<unknown, never>(`/dex/cancel`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};
