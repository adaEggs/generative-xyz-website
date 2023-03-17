import { LogLevel } from '@enums/log-level';
import { get, post } from '@services/http-client';
import log from '@utils/logger';
import {
  BINANCE_PAIR,
  FeeRateName,
  HistoryStatusColor,
  HistoryStatusType,
  ICollectedUTXOResp,
  IEstimateThorResp,
  IEstimateThorSwapReq,
  IFeeRate,
  IHistoryResp,
  IListingPayload,
  IPendingUTXO,
  IReqGenAddressByETH,
  IReqSubmitSwapETH,
  IRespGenAddressByETH,
  IRetrieveOrderPayload,
  IRetrieveOrderResp,
  IRetrieveOrdersPayload,
  IRetrieveOrdersResp,
  ITokenPriceResp,
  ITrackTx,
  ITxHistory,
  ITxHistoryBuyInsETH,
  ITxHistoryPurchase,
} from '@interfaces/api/bitcoin';
import axios from 'axios';
import { isExpiredUnixTime } from '@utils/time';
import { orderBy } from 'lodash';
import { BINANCE_API_URL, THOR_SWAP_API_URL } from '@constants/config';
import BigNumber from 'bignumber.js';

const LOG_PREFIX = 'COLLECTED_NFT';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string
): Promise<ICollectedUTXOResp | undefined> => {
  try {
    const res = await get<ICollectedUTXOResp>(
      `/wallet/wallet-info?address=${btcAddress}`
    );

    return res;
    // const pendingUTXOs = await getPendingUTXOs(btcAddress);
    //
    // return filterCurrentAssets(res, pendingUTXOs);
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const getPendingUTXOs = async (
  btcAddress: string
): Promise<IPendingUTXO[]> => {
  let pendingUTXOs = [];
  if (!btcAddress) return [];
  try {
    const res = await axios.get(
      `https://blockstream.info/api/address/${btcAddress}/txs`
    );
    pendingUTXOs = (res.data || []).filter(
      (item: IPendingUTXO) => !item.status.confirmed
    );
  } catch (err) {
    // throw new Error('Request pending UTXOs error');
  }
  return pendingUTXOs;
};

export const filterCurrentAssets = (
  current: ICollectedUTXOResp | undefined,
  pending: IPendingUTXO[]
): ICollectedUTXOResp | undefined => {
  if (!pending || !pending.length || !current) return current;

  const utxos = current.txrefs.filter(({ tx_hash, tx_output_n }) => {
    const isExist = pending.some(item =>
      item.vin.some(vin => vin.txid === tx_hash && vin.vout === tx_output_n)
    );
    return !isExist;
  });

  return {
    ...current,
    txrefs: utxos,
  };
};

export const getFeeRate = async (): Promise<IFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    const fee: IFeeRate = await res.json();
    if (fee[FeeRateName.fastestFee] <= 10) {
      return {
        [FeeRateName.fastestFee]: 15,
        [FeeRateName.halfHourFee]: 10,
        [FeeRateName.hourFee]: 5,
      };
    }
    return fee;
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

const statusMapper = (
  createdAt: string | number,
  respStatus: HistoryStatusType,
  isTxs = true
) => {
  let statusColor: HistoryStatusColor = '#ff7e21';
  let status: HistoryStatusType = HistoryStatusType.pending;
  const now = new Date().getTime();
  const isExpired = isExpiredUnixTime({
    unixTime: createdAt || now,
    expiredMin: 4,
  });
  if (isExpired || !isTxs) {
    status = respStatus;
    switch (status) {
      case HistoryStatusType.pending:
      case HistoryStatusType.cancelling:
      case HistoryStatusType.listing:
      case HistoryStatusType.buying:
      case HistoryStatusType.waitingPayment:
      case HistoryStatusType.refunding:
      case HistoryStatusType.refunded:
      case HistoryStatusType.receivedPayment:
        statusColor = '#ff7e21';
        break;
      case HistoryStatusType.bought:
      case HistoryStatusType.matched:
      case HistoryStatusType.success:
        statusColor = '#24c087';
        break;
      case HistoryStatusType.failed:
        statusColor = '#ff4747';
        break;
      case HistoryStatusType.cancelled:
        statusColor = '#5b5b5b';
        break;
    }
  }
  return {
    statusColor,
    status,
    isExpired,
  };
};

const getTxsHistory = async (address: string): Promise<ITxHistory[]> => {
  let history: ITxHistory[] = [];
  try {
    history = await get<ITxHistory[]>(
      `/wallet/txs?address=${address}&limit=30&offset=0`
    );
  } catch (_) {
    log('failed to get txs history', LogLevel.ERROR, LOG_PREFIX);
  }
  return history || [];
};

const getTxsETHHistory = async (): Promise<ITxHistoryBuyInsETH[]> => {
  let history: ITxHistoryBuyInsETH[] = [];
  try {
    history = await get<ITxHistoryBuyInsETH[]>(
      `/dex/buy-eth-history?limit=20&offset=0`
    );
  } catch (_) {
    log('failed to get txs eth history', LogLevel.ERROR, LOG_PREFIX);
  }
  return history || [];
};

const getTxsPurchaseHistory = async (): Promise<ITxHistoryPurchase[]> => {
  let history: ITxHistoryPurchase[] = [];
  try {
    history = await get<ITxHistoryPurchase[]>(`/dex/history`);
  } catch (_) {
    log('failed to get txs purchase history', LogLevel.ERROR, LOG_PREFIX);
  }
  return history || [];
};

export const getHistory = async (address: string): Promise<IHistoryResp> => {
  try {
    const [txs, txsETH, txsPurchase] = await Promise.all([
      await getTxsHistory(address),
      await getTxsETHHistory(),
      await getTxsPurchaseHistory(),
    ]);
    const _txsETH = txsETH.map(history => {
      const { statusColor, isExpired, status } = statusMapper(
        history.created_at,
        history.status,
        false
      );
      return {
        ...history,
        statusColor,
        status,
        isExpired,
      };
    });
    const _txsPurchase = txsPurchase.map(history => {
      const { statusColor, isExpired, status } = statusMapper(
        history.timestamp,
        history.type,
        false
      );
      return {
        ...history,
        statusColor,
        status,
        isExpired,
      };
    });

    const _txs = (txs || []).map(history => {
      const { statusColor, isExpired, status } = statusMapper(
        history.created_at,
        history.status,
        true
      );

      return {
        ...history,
        statusColor,
        status,
        isExpired,
      };
    });
    return {
      txs: orderBy(_txs, item => item.created_at, 'desc'),
      txsETH: orderBy(_txsETH, item => item.created_at, 'desc'),
      txsPurchase: orderBy(_txsPurchase, item => item.timestamp, 'desc'),
    };
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const broadcastTx = async (txHex: string) => {
  try {
    await axios.post(`https://blockstream.info/api/tx`, txHex);
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw new Error(
      'There was an issue when broadcasting the transaction to the BTC network.'
    );
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
  let data: IRetrieveOrderResp = {
    raw_psbt: '',
    buyable: false,
    sell_verified: false,
    priceBTC: 0,
    priceETH: '0',
    orderID: '',
  };
  try {
    data = await get<IRetrieveOrderResp>(
      `/dex/retrieve-order?${payload?.orderID ? 'order_id' : 'inscription'}=${
        payload?.orderID || payload.inscriptionID || ''
      }`
    );
  } catch (err: unknown) {
    log('failed to get retrieve order', LogLevel.ERROR, LOG_PREFIX);
    // throw err;
  }
  return data;
};

export const retrieveOrders = async (
  payload: IRetrieveOrdersPayload
): Promise<IRetrieveOrdersResp | undefined> => {
  try {
    return post<IRetrieveOrdersPayload, IRetrieveOrdersResp>(
      '/dex/retrieve-orders',
      payload
    );
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

export const getGenDepositAddressETH = async (
  payload: IReqGenAddressByETH
): Promise<IRespGenAddressByETH> => {
  try {
    const res = await post<IReqGenAddressByETH, never>(
      '/dex/gen-eth-order',
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to get getThorDepositAddress', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const estimateETH2BTC = async ({
  sellAmount,
  receiver,
}: IEstimateThorSwapReq): Promise<IEstimateThorResp> => {
  try {
    const res = await fetch(
      `${THOR_SWAP_API_URL}/quote/swap?amount=${sellAmount}&from_asset=ETH.ETH&to_asset=BTC.BTC&destination=${receiver}`
    );
    const data: IEstimateThorResp = await res.json();
    return data;

    // if (data.error) {
    //   return data;
    // }
    // &tolerance_bps=100
    // const arrMemos = data.memo.split(':');
    // const minAmount = arrMemos[arrMemos.length - 1];
    // return {
    //   ...data,
    //   expected_amount_out: minAmount,
    // };
  } catch (err: unknown) {
    log('failed to get estimateETH2BTC', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const getTokenRate = async (
  pair: BINANCE_PAIR = 'ETHBTC'
): Promise<number> => {
  try {
    const res = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=${pair}`);
    const data: ITokenPriceResp = await res.json();
    const rate = data?.price;
    return new BigNumber(rate).toNumber();
  } catch (err: unknown) {
    log('failed to get estimateETH2BTC', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};

export const submitSwapETH = async (
  payload: IReqSubmitSwapETH
): Promise<IRespGenAddressByETH> => {
  try {
    const res = await post<IReqSubmitSwapETH, never>(
      '/dex/update-eth-order-tx',
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to get submitSwapETH', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
};
