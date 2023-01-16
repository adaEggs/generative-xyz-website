import {
  NETWORK_CHAIN_ID,
  PRINTS_REQUIRED_TO_DISCOUNT,
} from '@constants/config';
import { PRINTS_ADDRESS } from '@constants/contract-address';
import { getUserSelector } from '@redux/user/selector';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useAsyncEffect from 'use-async-effect';
import useContractOperation from './useContractOperation';
import Web3 from 'web3';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

const LOG_PREFIX = 'useIsFrameDiscounted';

const useIsFrameDiscounted = (): boolean => {
  const user = useSelector(getUserSelector);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const { call: getTokenBalance } = useContractOperation(
    GetTokenBalanceOperation,
    false
  );

  useAsyncEffect(async () => {
    if (!PRINTS_ADDRESS) {
      return;
    }

    try {
      const printsBalance = await getTokenBalance({
        chainID: NETWORK_CHAIN_ID,
        erc20TokenAddress: PRINTS_ADDRESS,
      });
      if (!printsBalance) {
        return;
      }

      const convertedBalance = parseFloat(
        Web3.utils.fromWei(printsBalance.toString())
      );
      if (convertedBalance >= PRINTS_REQUIRED_TO_DISCOUNT) {
        setIsDiscounted(true);
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.Error, LOG_PREFIX);
    }
  }, [user]);

  return isDiscounted;
};

export default useIsFrameDiscounted;
