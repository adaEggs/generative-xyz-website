import { LocalStorageKey } from '@enums/local-storage';

export class StorageService {
  private _getKey = (key: string) => key;

  getCustomKey(prefix: string, suffix: string) {
    return `${prefix}-${suffix}`;
  }

  set(key: string, data: unknown) {
    const _key = this._getKey(key);
    const dataStr = JSON.stringify(data);
    return localStorage.setItem(_key, dataStr);
  }

  get(key: string) {
    const _key = this._getKey(key);
    const dataStr = localStorage.getItem(_key);
    return dataStr ? JSON.parse(dataStr) : undefined;
  }

  remove(key: string) {
    const _key = this._getKey(key);
    return localStorage.removeItem(_key);
  }

  // User address taproot profile, key by web3 address
  private getUserTaprootKey = (evmAddress: string) => {
    return `${LocalStorageKey.WALLET_ADDRESS_TAPROOT}-${evmAddress}`;
  };
  getUserTaprootAddress = (evmAddress: string) => {
    const _key = this.getUserTaprootKey(evmAddress);
    return this.get(_key);
  };
  setUserTaprootAddress = (evmAddress: string, taprootAddress: string) => {
    const _key = this.getUserTaprootKey(evmAddress);
    return this.set(_key, taprootAddress);
  };
  removeUserTaprootAddress = (evmAddress: string) => {
    const _key = this.getUserTaprootKey(evmAddress);
    return this.remove(_key);
  };
}

const storage = new StorageService();

export default storage;
