import React, { useContext } from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalListForSale from '@components/Transactor/ButtonListForSale/Modal';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';

interface IProps {
  className?: string;
  title?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
}

const ButtonListForSale = React.memo(
  ({
    className,
    sizes = 'xsmall',
    title = 'List for sale',
    inscriptionID,
  }: IProps) => {
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

    return (
      <>
        <ButtonIcon
          sizes={sizes}
          className={cs(`${className}`)}
          onClick={openModal}
        >
          {title}
        </ButtonIcon>
        {!!user?.walletAddressBtcTaproot && (
          <ModalListForSale
            inscriptionID={inscriptionID}
            title={title}
            isShow={isShow}
            onHide={hideModal}
          />
        )}
      </>
    );
  }
);

ButtonListForSale.displayName = 'ButtonListForSale';

export default ButtonListForSale;
