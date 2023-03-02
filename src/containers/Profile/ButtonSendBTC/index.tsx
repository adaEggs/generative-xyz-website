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

  const toggle = () => setShow(value => !value);

  return (
    <>
      <ButtonIcon
        variants={'outline'}
        sizes={sizes}
        onClick={toggle}
        className={`${className}`}
      >
        {title}
      </ButtonIcon>
      <ModalSendBTC isShow={isShow} onHideModal={toggle} title={title} />
    </>
  );
};

export default ButtonSendBTC;
