import { IProjectMintFeeRate } from '@interfaces/api/project';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import cs from 'classnames';
import React, { useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import s from './styles.module.scss';
import { IFeeRateType } from './useMintFeeRate';

interface IProps {
  selectedRateType: IFeeRateType | undefined;
  handleChangeRateType: (rate: IFeeRateType) => void;

  customRate: string;
  handleChangeCustomRate?: (rate: string) => void;

  feeRate: IProjectMintFeeRate;
  payType: 'btc' | 'eth';
  useCustomRate?: boolean;
}

const MintFeeRate = ({
  handleChangeRateType,
  selectedRateType,
  feeRate,
  useCustomRate = false,
  handleChangeCustomRate,
  customRate,
  payType = 'btc',
}: IProps) => {
  const { economy, faster, fastest } = feeRate;

  const inputRef = useRef<HTMLInputElement>(null);

  const [cusRate, setCurRate] = useState('');

  const max = 50;
  const min = 0;

  const onChangeCustomSats = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof handleChangeCustomRate === 'function') {
      setCurRate(e.target.value);

      const value = Math.max(min, Math.min(max, Number(e.target.value)));
      handleChangeCustomRate(`${value}`);
    }
  };
  return (
    <div className={s.container}>
      <p className={s.header}>Select the network fee you want to pay:</p>
      <Row className={s.mintFeeWrapper}>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeRateType('economy');
              setCurRate('');
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRateType === 'economy' && !customRate,
            })}
          >
            <p className={s.feeTitle}>Economy</p>
            <p className={s.feeDetail}>{`${economy.rate} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${
                payType === 'btc'
                  ? formatBTCPrice(economy.mintFees.btc.networkFee) + ' BTC'
                  : formatEthPrice(economy.mintFees.eth.networkFee) + ' ETH'
              }`}
            </p>
          </div>
        </Col>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeRateType('faster');
              setCurRate('');
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRateType === 'faster' && !customRate,
            })}
          >
            <p className={s.feeTitle}>Faster</p>
            <p className={s.feeDetail}>{`${faster.rate} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${
                payType === 'btc'
                  ? formatBTCPrice(faster.mintFees.btc.networkFee) + ' BTC'
                  : formatEthPrice(faster.mintFees.eth.networkFee) + ' ETH'
              }`}
            </p>
          </div>
        </Col>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeRateType('fastest');
              setCurRate('');
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRateType === 'fastest' && !customRate,
            })}
          >
            <p className={s.feeTitle}>Fastest</p>
            <p className={s.feeDetail}>{`${fastest.rate} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${
                payType === 'btc'
                  ? formatBTCPrice(fastest.mintFees.btc.networkFee) + ' BTC'
                  : formatEthPrice(fastest.mintFees.eth.networkFee) + ' ETH'
              }`}
            </p>
          </div>
        </Col>
        <Col className={s.row}>
          {!!useCustomRate && (
            <div
              className={cs(s.mintFeeItem, {
                [`${s.mintFeeItem__active}`]: selectedRateType === 'customRate',
              })}
              onClick={() => {
                if (
                  !!handleChangeCustomRate &&
                  typeof handleChangeCustomRate === 'function' &&
                  !!inputRef &&
                  !!inputRef.current
                ) {
                  // handleChangeCustomRate(`${fastest.rate + 1}`);
                  inputRef.current.focus();
                  handleChangeRateType('customRate');
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
                value={customRate || cusRate}
                onChange={onChangeCustomSats}
                className={s.mintFeeItem_input}
              />
              <div className={s.feeTotalContainer}>
                {!!customRate && feeRate.customRate && (
                  <p className={s.feeTotal}>
                    ~{' '}
                    {`${
                      payType === 'btc'
                        ? formatBTCPrice(
                            feeRate.customRate.mintFees.btc.networkFee
                          ) + ' BTC'
                        : formatEthPrice(
                            feeRate.customRate.mintFees.eth.networkFee
                          ) + ' ETH'
                    }`}
                  </p>
                )}
                {/* {cusRate && Number(cusRate) <= feeRate.fastest.rate && (
                  <p>Customize Sats must be better than fastest</p>
                )} */}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MintFeeRate;
