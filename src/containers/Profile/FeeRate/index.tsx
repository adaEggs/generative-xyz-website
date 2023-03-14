import Text from '@components/Text';
import s from '@containers/Profile/FeeRate/styles.module.scss';
import { FeeRateName, IFeeRate } from '@interfaces/api/bitcoin';
import cs from 'classnames';
import { formatBTCPrice } from '@utils/format';
import React, { useRef } from 'react';
import * as SDK from 'generative-sdk';
import { Col, Row } from 'react-bootstrap';

interface IProps {
  handleChangeFee: (rate: FeeRateName) => void;
  handleChangeCustomRate?: (rate: string) => void;

  selectedRate: FeeRateName | undefined;
  customRate: string;

  allRate: IFeeRate;
  useCustomRate?: boolean;
}

const FeeRate = ({
  handleChangeFee,
  selectedRate,
  allRate,
  useCustomRate = false,
  handleChangeCustomRate,
  customRate,
}: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeCustomSats = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof handleChangeCustomRate === 'function') {
      handleChangeCustomRate(e.target.value);
    }
  };
  return (
    <div className={s.container}>
      <Text size="18" fontWeight="medium" className={s.header}>
        Select the network fee you want to pay:
      </Text>
      <Row className={s.mintFeeWrapper}>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeFee(FeeRateName.hourFee);
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRate === FeeRateName.hourFee && !customRate,
            })}
          >
            <p className={s.feeTitle}>Economy</p>
            <p className={s.feeDetail}>{`${allRate?.hourFee} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${formatBTCPrice(
                SDK.estimateTxFee(2, 2, allRate?.hourFee)
              )} BTC`}
            </p>
          </div>
        </Col>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeFee(FeeRateName.halfHourFee);
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRate === FeeRateName.halfHourFee && !customRate,
            })}
          >
            <p className={s.feeTitle}>Faster</p>
            <p
              className={s.feeDetail}
            >{`${allRate?.halfHourFee} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${formatBTCPrice(
                SDK.estimateTxFee(2, 2, allRate?.halfHourFee)
              )} BTC`}
            </p>
          </div>
        </Col>
        <Col className={s.row}>
          <div
            onClick={() => {
              handleChangeFee(FeeRateName.fastestFee);
            }}
            className={cs(s.mintFeeItem, {
              [`${s.mintFeeItem__active}`]:
                selectedRate === FeeRateName.fastestFee && !customRate,
            })}
          >
            <p className={s.feeTitle}>Fastest</p>
            <p className={s.feeDetail}>{`${allRate?.fastestFee} sats/vByte`}</p>
            <p className={s.feeTotal}>
              ~{' '}
              {`${formatBTCPrice(
                SDK.estimateTxFee(2, 2, allRate?.fastestFee)
              )} BTC`}
            </p>
          </div>
        </Col>
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
              {!!customRate && (
                <p className={s.feeTotal}>
                  ~{' '}
                  {`${formatBTCPrice(
                    SDK.estimateTxFee(2, 2, Number(customRate || 0))
                  )} BTC`}
                </p>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FeeRate;
