import { SimpleLoading } from '@components/SimpleLoading';
import {
  ICollectedUTXOResp,
  IFeeRate,
  ITxHistory,
} from '@interfaces/api/bitcoin';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { getCollectedUTXO, getFeeRate, getHistory } from '@services/bitcoin';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { getError } from '@utils/text';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import bitcoinStorage from '@bitcoin/utils/storage';
import { useRouter } from 'next/router';
import { validateBTCAddress } from '@utils/validate';
import { ROUTE_PATH } from '@constants/route-path';

const LOG_PREFIX = 'ASSETS_CONTEXT';

export interface IAssetsContext {
  currentAssets: ICollectedUTXOResp | undefined;
  assets: ICollectedUTXOResp | undefined;
  isLoadingAssets: boolean;
  isLoadedAssets: boolean;

  history: ITxHistory[];
  isLoadingHistory: boolean;
  isLoadedHistory: boolean;

  feeRate: IFeeRate | undefined;

  fetchAssets: () => void;
  fetchHistory: () => void;
  debounceFetchData: () => void;
  fetchFeeRate: () => void;
}

const initialValue: IAssetsContext = {
  currentAssets: undefined,
  assets: undefined,
  isLoadingAssets: false,
  isLoadedAssets: false,

  history: [],
  isLoadingHistory: false,
  isLoadedHistory: false,

  feeRate: undefined,

  fetchAssets: () => new Promise<void>(r => r()),
  fetchHistory: () => new Promise<void>(r => r()),
  debounceFetchData: () => new Promise<void>(r => r()),
  fetchFeeRate: () => new Promise<void>(r => r()),
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const { walletAddress } = router.query as { walletAddress: string };
  const currentAddress = React.useMemo(() => {
    if (
      !!walletAddress &&
      validateBTCAddress(walletAddress) &&
      router.asPath.includes(ROUTE_PATH.PROFILE)
    ) {
      return walletAddress;
    }
    return user?.walletAddressBtcTaproot || '';
  }, [user?.walletAddressBtcTaproot, router?.asPath, walletAddress]);

  // UTXOs
  const [assets, setAssets] = useState<ICollectedUTXOResp | undefined>();
  const [currentAssets, setCurrentAssets] = useState<
    ICollectedUTXOResp | undefined
  >();
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(false);
  const [isLoadedAssets, setIsLoadedAssets] = useState<boolean>(false);

  // History
  const [history, setHistory] = useState<ITxHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadedHistory, setIsLoadedHistory] = useState<boolean>(false);

  // Fee rate
  const [feeRate, setFeeRate] = useState<IFeeRate | undefined>();

  const fetchAssets = async (): Promise<ICollectedUTXOResp | undefined> => {
    if (!currentAddress) return undefined;
    let _assets = undefined;
    try {
      setIsLoadingAssets(true);
      _assets = await getCollectedUTXO(currentAddress);
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

  const fetchHistory = async (): Promise<ITxHistory[]> => {
    if (!currentAddress) return [];
    let _history: ITxHistory[] = [];
    try {
      setIsLoadingHistory(true);
      _history = await getHistory(currentAddress);
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
    const [assets, history] = await Promise.all([
      await fetchAssets(),
      await fetchHistory(),
    ]);

    const _currentUTXOs = bitcoinStorage.filterPendingUTXOsByHistory({
      history,
      utxos: assets?.txrefs || [],
      trAddress: currentAddress,
    });

    let _currentAssets = undefined;
    if (assets) {
      _currentAssets = {
        ...assets,
        txrefs: [..._currentUTXOs],
      };
    }
    setCurrentAssets(_currentAssets);
  };

  const debounceFetchData = React.useCallback(debounce(fetchData, 300), [
    user?.walletAddressBtcTaproot,
  ]);

  const fetchFeeRate = async () => {
    try {
      const feeRate = await getFeeRate();
      setFeeRate(feeRate);
    } catch (error) {
      setFeeRate({
        fastestFee: 15,
        halfHourFee: 10,
        hourFee: 5,
      });
    }
  };

  useEffect(() => {
    if (currentAddress) {
      debounceFetchData();
    } else {
      setHistory([]);
    }
  }, [currentAddress]);

  useEffect(() => {
    fetchFeeRate().then().catch();
    const intervalID = setInterval(fetchFeeRate, 10 * 60 * 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      currentAssets,
      assets,
      isLoadingAssets,
      isLoadedAssets,

      history,
      isLoadingHistory,
      isLoadedHistory,

      feeRate,

      fetchAssets,
      fetchHistory,
      fetchFeeRate,

      debounceFetchData,
    };
  }, [
    currentAssets,
    assets,
    isLoadingAssets,
    isLoadedAssets,

    history,
    isLoadingHistory,
    isLoadedHistory,

    feeRate,
  ]);

  return (
    <AssetsContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </AssetsContext.Provider>
  );
};
