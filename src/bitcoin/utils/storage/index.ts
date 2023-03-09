import { StorageService } from '@utils/storage';
import { LocalStorageKey } from '@enums/local-storage';
import {
  IFilterPendingUTXOsPayload,
  IGetPendingUTXOsPayload,
  IPendingUTXO,
  ISetPendingUTXOsPayload,
} from '@bitcoin/utils/storage/types';
import { getUTXOKey } from '@containers/Profile/ButtonSendBTC/utils';
import uniqBy from 'lodash/uniqBy';
import { isExpiredTimeClone } from '@utils/time';
import { HistoryStatusType } from '@interfaces/api/bitcoin';
import { UTXO } from 'generative-sdk';

class BitcoinStorage extends StorageService {
  constructor() {
    super();
  }

  /** Pending UTXOs */
  private _pendingKey = (trAddress: string) => {
    return `${LocalStorageKey.WALLET_ADDRESS_TAPROOT}-${trAddress}`;
  };
  getPendingUTXOs = ({
    trAddress,
  }: IGetPendingUTXOsPayload): IPendingUTXO[] => {
    const _key = this._pendingKey(trAddress);
    return this.get(_key) || [];
  };
  setPendingUTXOs = ({ trAddress, utxos, txHash }: ISetPendingUTXOsPayload) => {
    const _key = this._pendingKey(trAddress);
    const storedUTXOs = this.getPendingUTXOs({ trAddress });

    // mapping new data
    // update txIDKey, createdTime
    const newStoredUTXOs = utxos
      .map(utxo => {
        const txIDKey = getUTXOKey(utxo);
        const createdTime = new Date().getTime().toString();
        return {
          ...utxo,
          txIDKey,
          createdTime,
          txHash,
        };
      })
      .concat(storedUTXOs);
    const uniqUTXOs = uniqBy(newStoredUTXOs, item => item.txIDKey);

    // action store
    this.set(_key, uniqUTXOs);
  };
  filterPendingUTXOsByHistory = (
    payload: IFilterPendingUTXOsPayload
  ): UTXO[] => {
    const { trAddress, utxos, history } = payload;
    if (!utxos || !history || !history.length || !utxos.length) return [];

    const _key = this._pendingKey(trAddress);
    let storedUTXOs = this.getPendingUTXOs({ trAddress });
    storedUTXOs =
      [...storedUTXOs].filter(({ txHash, createdTime }) => {
        const isExpired = isExpiredTimeClone({
          time: Number(createdTime || 0) / 1000, // UNIX time
          expiredMin: 5,
        });

        // not expired, keep UTXO in storage
        if (!isExpired) return true;

        const _history = history.find(history => history.txhash === txHash);

        // can't find from history, free this UTXO
        if (!_history) return false;

        // remove with status
        const removes = [
          HistoryStatusType.failed,
          HistoryStatusType.cancelled,
          HistoryStatusType.success,
          HistoryStatusType.matched,
        ];
        const isRemove = removes.some(status => status === _history.status);
        return !isRemove;
      }) || [];

    const availableUTXOs = (utxos || []).filter(utxo => {
      const txIDKey = getUTXOKey(utxo);
      const isPending = storedUTXOs.some(item => item.txIDKey === txIDKey);
      return !isPending;
    });

    this.set(_key, storedUTXOs);
    return availableUTXOs;
  };
}

const bitcoinStorage = new BitcoinStorage();

export default bitcoinStorage;
