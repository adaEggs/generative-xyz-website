import { UTXO } from 'generative-sdk';
import { getUTXOKey } from '@containers/Profile/ButtonSendBTC/utils';
import { IStorageUTXO } from '@containers/Profile/ButtonSendBTC/types';

const getStorageKey = () => {
  return `storage-send-btc`;
};

const getPendingUTXOs = (): IStorageUTXO[] => {
  const storeKey = getStorageKey();

  const expiredTime = 60 * 60 * 1000; // 60 mins

  const utxos: IStorageUTXO[] = JSON.parse(
    localStorage.getItem(storeKey) || '[]'
  );
  const filter = utxos.filter(utxo => {
    const createdTime = utxo.createdTime;
    const now = new Date().getTime();
    const isExpired = now - Number(createdTime) > expiredTime;
    return !isExpired;
  });
  localStorage.setItem(storeKey, JSON.stringify(filter));
  return filter;
};

const setPendingUTXOs = (utxos: UTXO[]) => {
  const storeKey = getStorageKey();
  const mappedUTXOs: IStorageUTXO[] = utxos.map(utxo => {
    const txIDKey = getUTXOKey(utxo);
    const createdTime = new Date().getTime().toString();
    return {
      ...utxo,
      txIDKey,
      createdTime,
    };
  });
  const storageData = (mappedUTXOs || []).concat(getPendingUTXOs() || []);
  localStorage.setItem(storeKey, JSON.stringify(storageData));
};

export { getPendingUTXOs, setPendingUTXOs };
