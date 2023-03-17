import Text from '@components/Text';
import s from '@containers/Profile/FeeRate/styles.module.scss';
import { FeeRateName, IFeeRate } from '@interfaces/api/bitcoin';
import cs from 'classnames';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import React, { useContext, useImperativeHandle, useRef } from 'react';
import * as SDK from 'generative-sdk';
import { Col, Row } from 'react-bootstrap';
import { AssetsContext } from '@contexts/assets-context';
import BigNumber from 'bignumber.js';
import { Token } from '@interfaces/token';

type FeeType = 'normal' | 'buyETH' | 'buyBTC' | 'buyBTCSweep';

interface IProps {
  handleChangeFee: (rate: FeeRateName) => void;
  handleChangeCustomRate?: (rate: string) => void;

  selectedRate: FeeRateName | undefined;
  customRate: string;

  allRate: IFeeRate;
  useCustomRate?: boolean;
  feeType?: FeeType;
  options?: {
    hasRoyalty?: boolean;
    feeETH?: string;
    loading?: boolean;
    tokens?: Token[];
    hideAmount?: boolean;
  };
}
export interface IRef {
  getCurrentFee: () => string;
}

const FeeRate = React.forwardRef(
  (
    {
      handleChangeFee,
      selectedRate,
      allRate,
      useCustomRate = false,
      handleChangeCustomRate,
      customRate,
      feeType = 'normal',
      options = undefined,
    }: IProps,
    ref?: React.ForwardedRef<IRef>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { eth2btcRate } = useContext(AssetsContext);
    const onChangeCustomSats = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof handleChangeCustomRate === 'function') {
        handleChangeCustomRate(e.target.value);
      }
    };

    const convert2ETH = (amount: string | number) => {
      return formatBTCPrice(
        new BigNumber(amount)
          .dividedBy(eth2btcRate)
          .multipliedBy(1e8)
          .toString()
      );
    };

    const calcAmountBuyETH = (feeRate: number | string) => {
      const hasRoyalty = !!options && !!options?.hasRoyalty;
      const feeRateNumb = Number(feeRate);

      const amountNano = hasRoyalty
        ? SDK.estimateTxFee(4, 3, Number(feeRateNumb)) +
          SDK.estimateTxFee(1, 2, Number(feeRateNumb)) +
          1000
        : SDK.estimateTxFee(3, 2, Number(feeRateNumb)) +
          SDK.estimateTxFee(1, 2, Number(feeRateNumb)) +
          1000;

      const amount = formatBTCPrice(convert2ETH(amountNano), '0.0', 4);
      return {
        amount,
        symbol: 'ETH',
      };
    };

    const calcAmountBuyBTCSweep = (
      feeRate: number | string,
      tokens: Token[]
    ) => {
      // one for dummy utxo, one for network fee
      let numIns = 2 + tokens.length;
      // one for new dummy utxo, one for change value
      let numOuts = 2 + tokens.length;
      tokens.forEach(_ => {
        numIns += 2;
        numOuts += 2;
      });

      const input = SDK.estimateTxFee(numIns, numOuts, Number(feeRate));
      const split = SDK.estimateTxFee(
        numIns,
        tokens.length + 2,
        Number(feeRate)
      );
      const amount = formatBTCPrice(
        new BigNumber(input).plus(split).toString()
      );
      return {
        amount,
        symbol: 'BTC',
      };
    };

    const calcAmount = (feeRate: number | string, rateName?: FeeRateName) => {
      let amount = formatBTCPrice(SDK.estimateTxFee(2, 2, Number(feeRate)));
      let symbol = 'BTC';
      if (feeType === 'buyETH') {
        const isActive =
          (!rateName && !!customRate) ||
          (selectedRate === rateName && !customRate);
        if (isActive && options?.feeETH && !options?.loading) {
          amount = formatEthPrice(options.feeETH);
          symbol = 'ETH';
        } else {
          const { amount: _amount, symbol: _symbol } =
            calcAmountBuyETH(feeRate);
          amount = _amount;
          symbol = _symbol;
        }
      } else if (feeType === 'buyBTC') {
        amount = formatBTCPrice(SDK.estimateTxFee(5, 5, Number(feeRate)));
        symbol = 'BTC';
      } else if (feeType === 'buyBTCSweep' && !!options?.tokens) {
        const { amount: _amount, symbol: _symbol } = calcAmountBuyBTCSweep(
          feeRate,
          options?.tokens
        );
        amount = _amount;
        symbol = _symbol;
      }
      return {
        amount,
        symbol,
      };
    };
    const renderItem = (rateName: FeeRateName) => {
      const { amount, symbol } = calcAmount(allRate[rateName], rateName);
      let label = 'Economy';
      switch (rateName) {
        case FeeRateName.hourFee:
          label = 'Economy';
          break;
        case FeeRateName.halfHourFee:
          label = 'Faster';
          break;
        case FeeRateName.fastestFee:
          label = 'Fastest';
          break;
      }
      return (
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeFee(rateName);
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRate === rateName && !customRate,
            })}
          >
            <p className={s.feeTitle}>{label}</p>
            <p className={s.feeDetail}>{`${allRate[rateName]} sats/vByte`}</p>
            {!options?.hideAmount && (
              <p className={s.feeTotal}>~ {`${amount} ${symbol}`}</p>
            )}
          </div>
        </Col>
      );
    };

    const renderCustomRate = () => {
      const { amount, symbol } = calcAmount(customRate || 0);
      return (
        <Col className={s.row}>
          {!!useCustomRate && (
            <div
              className={cs(s.mintFeeItem, {
                [`${s.mintFeeItem__active}`]: !!customRate,
              })}
              onClick={() => {
                if (
                  !!handleChangeCustomRate &&
                  typeof handleChangeCustomRate === 'function' &&
                  !!inputRef &&
                  !!inputRef.current
                ) {
                  handleChangeCustomRate(
                    `${Number(allRate[FeeRateName.fastestFee]) + 1}`
                  );
                  inputRef.current.focus();
                }
              }}
            >
              <p className={s.feeTitle}>Customize Sats</p>
              <p className={s.feeDetail}>{`${customRate || 0} sats/vByte`}</p>
              <input
                ref={inputRef}
                id="feeRate"
                type="number"
                name="feeRate"
                placeholder="0"
                value={customRate}
                onChange={onChangeCustomSats}
                className={s.mintFeeItem_input}
              />
              {!!customRate && !options?.hideAmount && (
                <p className={s.feeTotal}>~ {`${amount} ${symbol}`}</p>
              )}
            </div>
          )}
        </Col>
      );
    };

    useImperativeHandle(ref, () => ({
      getCurrentFee() {
        if (!selectedRate) return '0';
        const { amount } = calcAmount(
          customRate ? customRate : allRate[selectedRate],
          customRate ? undefined : selectedRate
        );
        return amount;
      },
    }));

    return (
      <div className={s.container}>
        <Text size="18" fontWeight="medium" className={s.header}>
          Select the network fee you want to pay:
        </Text>
        <Row className={s.mintFeeWrapper}>
          {renderItem(FeeRateName.hourFee)}
          {renderItem(FeeRateName.halfHourFee)}
          {renderItem(FeeRateName.fastestFee)}
          {renderCustomRate()}
        </Row>
      </div>
    );
  }
);

FeeRate.displayName = 'FeeRate';

export default FeeRate;
