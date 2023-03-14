import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalSendBTC from '@containers/Profile/ButtonSendBTC/ModalSendBTC';
import React from 'react';

interface IProps {
  className?: string;
  title?: string;
  sizes?: ButtonSizesType;
}

const ButtonSendBTC = ({
  className,
  title = 'Send BTC',
  sizes = 'large',
}: IProps) => {
  const [isShow, setShow] = React.useState(false);

  const hideModal = () => {
    setShow(false);
  };

  const openModal = () => {
    setShow(true);
  };

  return (
    <>
      <ButtonIcon
        variants={'outline'}
        sizes={sizes}
        onClick={openModal}
        className={`${className}`}
      >
        {title}
      </ButtonIcon>
      <ModalSendBTC isShow={isShow} onHideModal={hideModal} title={title} />
    </>
  );
};

export default ButtonSendBTC;
