import QRCodeGenerator from '@components/QRCodeGenerator';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import {
  ICollectedNFTItemDetail,
  IStatusTransactionMint,
} from '@interfaces/api/profile';
import { ellipsisCenter, formatBTCPrice, formatEthPrice } from '@utils/format';
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import s from '../styles.module.scss';

export interface IStep {
  nft: ICollectedNFTItemDetail;
  step: IStatusTransactionMint;
  index: number;
  isHideIndicator: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentActiveStep: any;
}

const Step = (props: IStep): JSX.Element => {
  const { step, index, isHideIndicator, currentActiveStep, nft } = props;

  const { status, message, tx } = step;

  const unit = nft.payType === 'btc' ? 'BTC' : 'ETH';
  const formatPrice =
    nft.payType === 'btc'
      ? formatBTCPrice(nft.amount || 0, '0.0')
      : formatEthPrice(`${nft.amount || 0}`, '0.0');

  const isActiveStep = currentActiveStep.current >= index;
  const isVerifyStep = currentActiveStep.current > index && status;

  if (status) {
    currentActiveStep.current = index + 1;
  }

  const [isShowStep, setIsShowStep] = useState(
    currentActiveStep.current === index
  );

  const onClickCopy = (text: string) => {
    copy(text);
    toast.remove();
    toast.success('Copied');
  };

  const onClick = () => {
    if (index === 0 && status) {
      return;
    }
    if (isActiveStep) {
      setIsShowStep(!isShowStep);
    }
  };
  const renderTx = (tx?: string) => {
    if (!tx || !nft) {
      return <></>;
    }
    const linkTxHash =
      nft.payType === 'btc'
        ? `https://www.blockchain.com/explorer/transactions/btc/${tx}`
        : `https://etherscan.io/tx/${tx}`;

    return (
      <div className={s.transaction_tx}>
        <Stack direction="horizontal" gap={3}>
          <Text size="16">{ellipsisCenter({ str: tx, limit: 12 })}</Text>
          <SvgInset
            size={18}
            svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
            className={s.wrapHistory_copy}
            onClick={() => onClickCopy(tx)}
          />
          <SvgInset
            size={18}
            svgUrl={`${CDN_URL}/icons/ic-share.svg`}
            className={s.wrapHistory_copy}
            onClick={() => window.open(linkTxHash)}
          />
        </Stack>
      </div>
    );
  };

  const renderPendingPayment = () => {
    if (status) {
      return <></>;
    }
    return (
      <div className={s.payment_detail}>
        <p className={s.payment_detail_desc}>
          Send{' '}
          <span style={{ fontWeight: 'bold' }}>
            {formatPrice} {unit}
          </span>{' '}
          to this address
        </p>
        <QRCodeGenerator
          className={s.payment_detail_qrCodeGenerator}
          size={96}
          value={nft?.receiveAddress || ''}
        />
        <div
          className={s.payment_detail_amount}
          onClick={() => onClickCopy(nft?.receiveAddress || '')}
        >
          <p className={s.payment_detail_amount_text}>
            {ellipsisCenter({ str: nft?.receiveAddress || '', limit: 10 })}
          </p>
          <SvgInset
            className={s.payment_detail_amount_ic}
            size={18}
            svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={s.step}>
      <div className={s.header} onClick={onClick}>
        <div
          className={`${s.indexContainer} ${
            isVerifyStep ? '' : isActiveStep ? s.active : ''
          }`}
        >
          {isVerifyStep ? (
            <SvgInset
              size={20}
              svgUrl={`${CDN_URL}/icons/ic-check-status.svg`}
            />
          ) : (
            <p className={`${s.indexTitle} ${isActiveStep ? s.active : ''}`}>
              {index + 1}
            </p>
          )}
        </div>

        <Text
          fontWeight={'regular'}
          size={'20'}
          className={`${s.header_title} ${isActiveStep ? s.active : ''}`}
        >
          {message}
        </Text>
      </div>
      <div className={s.content}>
        {!isHideIndicator ? (
          <div
            className={`${s.content_indicator} ${isActiveStep ? s.active : ''}`}
          />
        ) : (
          <div className={s.content_empty} />
        )}
        {isShowStep && (
          <div>{index === 0 ? renderPendingPayment() : renderTx(tx)}</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Step);
