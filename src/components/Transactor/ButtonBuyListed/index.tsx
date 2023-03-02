import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalBuyListed from '@components/Transactor/ButtonBuyListed/Modal';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { formatBTCPrice } from '@utils/format';
import { WalletContext } from '@contexts/wallet-context';

interface IProps {
  title?: string;
  className?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
  price: number | string;
}

const ButtonBuyListed = React.memo(
  ({ title, className, sizes = 'xsmall', inscriptionID, price }: IProps) => {
    const [isShow, setShow] = React.useState(false);
    const user = useSelector(getUserSelector);
    const walletCtx = useContext(WalletContext);

    const openModal = async () => {
      if (!user || !user.walletAddressBtcTaproot) {
        await walletCtx.connect();
      }
      setShow(true);
    };

    const hideModal = () => {
      setShow(false);
    };

    const label = React.useMemo(() => {
      if (title) return title;
      return `Buy ${formatBTCPrice(price)} BTC`;
    }, [title, price]);

    return (
      <>
        <ButtonIcon
          sizes={sizes}
          className={cs(`${className}`)}
          onClick={openModal}
        >
          {label}
        </ButtonIcon>
        {!!user?.walletAddressBtcTaproot && (
          <ModalBuyListed
            inscriptionID={inscriptionID}
            title="Payment"
            isShow={isShow}
            price={price}
            onHide={hideModal}
          />
        )}
      </>
    );
  }
);

ButtonBuyListed.displayName = 'ButtonBuyListed';

export default ButtonBuyListed;
