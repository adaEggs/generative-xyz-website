import { BigNumber } from 'bignumber.js';
import { getError } from '@utils/text';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import React, { useContext } from 'react';
import * as SDK from 'generative-sdk';
import { FeeRateName } from '@interfaces/api/bitcoin';
import { formatBTCPrice } from '@utils/format';
import { AssetsContext } from '@contexts/assets-context';

const LOG_PREFIX = 'THOR_SWAP';

interface IProps {
  priceBTCNano: string | number;
}

interface IState {
  ethAmount: number;
  ethHumanAmount: string;
  networkFee: number;
}

const _initState = {
  ethAmount: 0,
  ethHumanAmount: '0',
  networkFee: 0,
};

const useThorSwap = ({ priceBTCNano }: IProps) => {
  const user = useSelector(getUserSelector);
  // human amount
  const [state, setState] = React.useState<IState>({ ..._initState });
  const { eth2btcRate, feeRate } = useContext(AssetsContext);

  // 1 ETH = ${rate} BTC
  // ? ETH = 0.1 BTC
  const onEstimateETHAmount = () => {
    try {
      if (!feeRate || !eth2btcRate) return;
      const fastFee = feeRate[FeeRateName.fastestFee];
      const networkFee =
        SDK.estimateTxFee(4, 4, fastFee) +
        SDK.estimateTxFee(1, 2, fastFee) +
        1000;
      const expectedBTCAmount = new BigNumber(priceBTCNano).plus(networkFee);
      const sendAmount = Math.ceil(
        new BigNumber(expectedBTCAmount).dividedBy(eth2btcRate).toNumber()
      );

      // calculator eth needed amount
      const ethHumanAmount = formatBTCPrice(sendAmount);
      const ethAmount = new BigNumber(ethHumanAmount)
        .multipliedBy(1e18)
        .toNumber();

      setState({
        ethAmount: ethAmount,
        ethHumanAmount,
        networkFee,
      });
    } catch (error) {
      const _err = getError(error);
      log(_err.message, LogLevel.ERROR, LOG_PREFIX + 'onEstimateETHAmount');
    }
  };

  React.useEffect(() => {
    onEstimateETHAmount();
  }, [user, eth2btcRate, feeRate]);

  return {
    state,
  };
};

export default useThorSwap;
