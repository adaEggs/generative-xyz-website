import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalBuyListed from '@components/Transactor/ButtonBuyListedFromETH/Modal';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import s from './styles.module.scss';
import useThorSwap from '@bitcoin/useThorSwap';
import { formatPrice } from '@utils/format';

interface IProps {
  className?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
  price: number | string;
  inscriptionNumber: number;
  orderID: string;
  isDetail?: boolean;
}

const ButtonBuyListedFromETH = React.memo(
  ({
    className,
    orderID,
    inscriptionID,
    inscriptionNumber,
    price,
    sizes = 'xsmall',
    isDetail = false,
  }: IProps) => {
    const [isShow, setShow] = React.useState(false);
    const user = useSelector(getUserSelector);
    const walletCtx = useContext(WalletContext);
    const taprootAddress = user?.walletAddressBtcTaproot;

    const { state } = useThorSwap({ priceBTCNano: price });

    const openModal = async () => {
      if (!user || !user.walletAddressBtcTaproot) {
        await walletCtx.connect();
      }
      setShow(true);
    };

    const hideModal = () => {
      setShow(false);
    };

    return (
      <>
        <ButtonIcon
          sizes={sizes}
          variants="outline"
          className={cs(s.container, `${className}`)}
          onClick={openModal}
        >
          Buy {`~${formatPrice(state.ethHumanAmount)} ETH`}
        </ButtonIcon>
        {!!taprootAddress && isShow && (
          <ModalBuyListed
            isDetail={!!isDetail}
            inscriptionNumber={inscriptionNumber}
            orderID={orderID}
            inscriptionID={inscriptionID}
            title={`Payment ${
              inscriptionNumber ? `#${inscriptionNumber}` : ''
            }`}
            isShow={isShow}
            price={price}
            onHide={hideModal}
          />
        )}
      </>
    );
  }
);

ButtonBuyListedFromETH.displayName = 'ButtonBuyListedFromETH';

export default ButtonBuyListedFromETH;
