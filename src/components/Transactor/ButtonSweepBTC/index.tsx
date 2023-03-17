import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import s from './styles.module.scss';
import { Token } from '@interfaces/token';
import { formatBTCPrice } from '@utils/format';
import ModalSweepBTC from '@components/Transactor/ButtonSweepBTC/Modal';
import BigNumber from 'bignumber.js';

interface IProps {
  className?: string;
  sizes?: ButtonSizesType;
  tokens: Token[];
}

const ButtonSweepBTC = React.memo(
  ({ className, sizes = 'xsmall', tokens }: IProps) => {
    const [isShow, setShow] = React.useState(false);
    const user = useSelector(getUserSelector);
    const walletCtx = useContext(WalletContext);
    const tpAddress = user?.walletAddressBtcTaproot;

    const isBuyable = !!tokens && tokens.length > 0;

    const amount = React.useMemo(() => {
      const origin = tokens.reduce(
        (partialSum, item) => partialSum.plus(item.priceBTC),
        new BigNumber(0)
      );
      return {
        origin,
        str: formatBTCPrice(origin.toString()),
      };
    }, [tokens]);

    const openModal = async () => {
      if (!tpAddress) {
        await walletCtx.connect();
      }
      setShow(true);
    };

    const hideModal = () => {
      setShow(false);
    };

    if (!isBuyable) {
      return (
        <ButtonIcon
          sizes={sizes}
          disabled={true}
          className={cs(s.container, `${className}`)}
          onClick={openModal}
        >
          Buy <span /> - BTC
        </ButtonIcon>
      );
    }
    return (
      <>
        <ButtonIcon
          sizes={sizes}
          className={cs(s.container, `${className}`)}
          onClick={openModal}
        >
          Buy {tokens.length} {tokens.length === 1 ? 'item' : 'items'} <span />{' '}
          {amount.str} BTC
        </ButtonIcon>
        {!!tpAddress && isShow && (
          <ModalSweepBTC
            isShow={isShow}
            onHide={hideModal}
            isDetail={true}
            title="Payment"
            tokens={tokens}
          />
        )}
      </>
    );
  }
);

ButtonSweepBTC.displayName = 'ButtonSweepBTC';

export default ButtonSweepBTC;
