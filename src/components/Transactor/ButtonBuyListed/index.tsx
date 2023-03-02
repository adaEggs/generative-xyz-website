import React from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalBuyListed from '@components/Transactor/ButtonBuyListed/Modal';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { formatBTCPrice } from '@utils/format';

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

    const toggleModal = () => setShow(value => !value);

    const label = React.useMemo(() => {
      if (title) return title;
      return `Buy ${formatBTCPrice(price)} BTC`;
    }, [title, price]);

    return (
      <>
        <ButtonIcon
          sizes={sizes}
          className={cs(`${className}`)}
          onClick={toggleModal}
        >
          {label}
        </ButtonIcon>
        {!!user?.walletAddressBtcTaproot && (
          <ModalBuyListed
            inscriptionID={inscriptionID}
            title="Payment"
            isShow={isShow}
            price={price}
            onHide={toggleModal}
          />
        )}
      </>
    );
  }
);

ButtonBuyListed.displayName = 'ButtonBuyListed';

export default ButtonBuyListed;
