import {
  IFilterPendingUTXO,
  IGetPendingUTXO,
  ISetPendingUTXO,
  IStorageUTXO,
} from '@bitcoin/storage/types';
import { isExpiredTime } from '@utils/time';
import { HistoryStatusType } from '@interfaces/api/bitcoin';
import { getUTXOKey } from '@containers/Profile/ButtonSendBTC/utils';

// bitcoin taproot address
const getStorageKey = (address: string) => {
  return `storage-btc-transactor-taproot-${address}`;
};

const getPendingUTXO = ({ address }: IGetPendingUTXO): IStorageUTXO[] => {
  const storeKey = getStorageKey(address);
  return JSON.parse(localStorage.getItem(storeKey) || '[]');
};

const filterPendingUTXO = ({
  address,
  history,
}: IFilterPendingUTXO): IStorageUTXO[] => {
  const storeKey = getStorageKey(address);
  const storageUTXOs = getPendingUTXO({ address });

  const newUTXOs =
    storageUTXOs.filter(({ tx_hash, createdTime }) => {
      const isExpired = isExpiredTime({
        time: Number(createdTime || 0) / 1000,
        expiredMin: 10,
      });

      // not expired, keep UTXO in storage
      if (!isExpired) return true;

      const _history = history.find(history => history.txhash === tx_hash);

      // can't find from history, free this UTXO
      if (!_history) return false;

      // fail, remove form storage, success or pending keep in storage
      return !(_history.status === HistoryStatusType.failed);
    }) || [];

  localStorage.setItem(storeKey, JSON.stringify(newUTXOs));

  return newUTXOs;
};

const setPendingUTXO = ({ address, utxos }: ISetPendingUTXO) => {
  const storeKey = getStorageKey(address);
  const storageUTXOs = getPendingUTXO({ address });
  const newUTXOs = utxos
    .map(_utxo => {
      const txIDKey = getUTXOKey(_utxo);
      const createdTime = new Date().getTime().toString();
      return {
        ..._utxo,
        txIDKey,
        createdTime,
      };
    })
    .concat(storageUTXOs);
  localStorage.setItem(storeKey, JSON.stringify(newUTXOs));
};

export { getPendingUTXO, setPendingUTXO, filterPendingUTXO };
