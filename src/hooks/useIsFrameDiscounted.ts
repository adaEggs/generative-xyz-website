import {
  NETWORK_CHAIN_ID,
  NFT_REQUIRED_TO_DISCOUNT,
  PRINTS_REQUIRED_TO_DISCOUNT,
} from '@constants/config';
import {
  GENART_MEMBERSHIP_ADDRESS,
  GENART_TOKEN_ADDRESS,
  PRINTS_ADDRESS,
} from '@constants/contract-address';
import { getUserSelector } from '@redux/user/selector';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import GetNFTBalanceOperation from '@services/contract-operations/erc721/get-token-balance';
import GetGenArtMembershipOperation from '@services/contract-operations/gen-art-membership/get-gen-art-membership';
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
  const { call: getNFTBalance } = useContractOperation(
    GetNFTBalanceOperation,
    false
  );
  const { call: getGenArtMembership } = useContractOperation(
    GetGenArtMembershipOperation,
    false
  );

  // Check PRINT token balance
  useAsyncEffect(async () => {
    if (!PRINTS_ADDRESS || !user) {
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
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  }, [user]);

  // Check GENART NFT balance
  useAsyncEffect(async () => {
    if (!GENART_TOKEN_ADDRESS || !user) {
      return;
    }

    try {
      const nftBalance = await getNFTBalance({
        chainID: NETWORK_CHAIN_ID,
        erc721TokenAddress: GENART_TOKEN_ADDRESS,
      });
      if (!nftBalance) {
        return;
      }

      if (nftBalance >= NFT_REQUIRED_TO_DISCOUNT) {
        setIsDiscounted(true);
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  }, [user]);

  // Check GENART membership
  useAsyncEffect(async () => {
    if (!GENART_MEMBERSHIP_ADDRESS || !user) {
      return;
    }

    try {
      const membershipData = await getGenArtMembership({
        chainID: NETWORK_CHAIN_ID,
      });

      if (!membershipData) {
        return;
      }

      if (membershipData.length > 0) {
        setIsDiscounted(true);
      }
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  }, [user]);

  return isDiscounted;
};

export default useIsFrameDiscounted;
