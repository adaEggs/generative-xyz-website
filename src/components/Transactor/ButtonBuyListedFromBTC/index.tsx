import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalBuyListed from '@components/Transactor/ButtonBuyListedFromBTC/Modal';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { formatBTCPrice } from '@utils/format';
import { WalletContext } from '@contexts/wallet-context';
import s from './styles.module.scss';

interface IProps {
  className?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
  price: number | string;
  inscriptionNumber: number;
  orderID: string;
  isDetail?: boolean;
}

const ButtonBuyListedFromBTC = React.memo(
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
          className={cs(s.container, `${className}`)}
          onClick={openModal}
        >
          {`${formatBTCPrice(price)} BTC`}
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

ButtonBuyListedFromBTC.displayName = 'ButtonBuyListedFromBTC';

export default ButtonBuyListedFromBTC;
