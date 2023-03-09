import { SimpleLoading } from '@components/SimpleLoading';
import { ICollectedUTXOResp, ITxHistory } from '@interfaces/api/bitcoin';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { getCollectedUTXO, getHistory } from '@services/bitcoin';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { getError } from '@utils/text';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
// import bitcoinStorage from '@bitcoin/utils/storage';

const LOG_PREFIX = 'UTXO_CONTEXT';

export interface IUTXOContext {
  assets: ICollectedUTXOResp | undefined;
  isLoadingAssets: boolean;
  isLoadedAssets: boolean;

  history: ITxHistory[];
  isLoadingHistory: boolean;
  isLoadedHistory: boolean;

  fetchAssets: () => void;
  fetchHistory: () => void;
}

const initialValue: IUTXOContext = {
  assets: undefined,
  isLoadingAssets: false,
  isLoadedAssets: false,

  history: [],
  isLoadingHistory: false,
  isLoadedHistory: false,

  fetchAssets: () => new Promise<void>(r => r()),
  fetchHistory: () => new Promise<void>(r => r()),
};

export const UTXOContext = React.createContext<IUTXOContext>(initialValue);

export const UTXOProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);

  // UTXOs
  const [assets, setAssets] = useState<ICollectedUTXOResp | undefined>();
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(false);
  const [isLoadedAssets, setIsLoadedAssets] = useState<boolean>(false);

  // History
  const [history, setHistory] = useState<ITxHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadedHistory, setIsLoadedHistory] = useState<boolean>(false);

  const fetchAssets = async () => {
    if (!user || !user?.walletAddressBtcTaproot) return;
    let _assets = undefined;
    try {
      setIsLoadingAssets(true);
      _assets = await getCollectedUTXO(user.walletAddressBtcTaproot);
      setAssets(_assets);
    } catch (err) {
      const error = getError(err);
      log(error.message, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsLoadingAssets(false);
      setIsLoadedAssets(true);
    }
    return _assets;
  };

  const fetchHistory = async () => {
    if (!user || !user?.walletAddressBtcTaproot) return;
    let _history: ITxHistory[] = [];
    try {
      setIsLoadingHistory(true);
      _history = await getHistory(user.walletAddressBtcTaproot);
      setHistory(_history);
    } catch (err) {
      const error = getError(err);
      log(error.message, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsLoadingHistory(false);
      setIsLoadedHistory(true);
    }
    return _history;
  };

  const fetchData = async () => {
    // const tasks = [await fetchAssets(), await fetchHistory()];
    // const [assets, history] = await Promise.all(tasks);
    // const filteredUTXOs = bitcoinStorage.filterPendingUTXOsByHistory({
    //   history,
    //   utxos: assets.,
    // });
  };

  const debounceFetchData = React.useCallback(debounce(fetchData, 300), [
    user?.walletAddressBtcTaproot,
  ]);

  useEffect(() => {
    if (!!user && !!user?.walletAddressBtcTaproot) {
      debounceFetchData();
    } else {
      setHistory([]);
    }
  }, [user?.walletAddressBtcTaproot]);

  const contextValues = useMemo((): IUTXOContext => {
    return {
      assets,
      isLoadingAssets,
      isLoadedAssets,

      history,
      isLoadingHistory,
      isLoadedHistory,

      fetchAssets,
      fetchHistory,
    };
  }, [
    assets,
    isLoadingAssets,
    isLoadedAssets,
    history,
    isLoadingHistory,
    isLoadedHistory,
  ]);

  return (
    <UTXOContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </UTXOContext.Provider>
  );
};
