import ButtonIcon from '@components/ButtonIcon';
import ModalSendBTC from '@containers/Profile/ButtonSendBTC/ModalSendBTC';
import React from 'react';

interface IProps {
  className?: string;
  title?: string;
}

const ButtonSendBTC = ({ className, title = 'Send BTC' }: IProps) => {
  const [isShow, setShow] = React.useState(false);

  const toggle = () => setShow(value => !value);

  return (
    <>
      <ButtonIcon
        variants={'outline'}
        sizes={'large'}
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
