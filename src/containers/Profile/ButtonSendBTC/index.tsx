import ButtonIcon from '@components/ButtonIcon';
import ModalSendBTC from '@containers/Profile/ButtonSendBTC/ModalSendBTC';
import React from 'react';

const ButtonSendBTC = ({ className }: { className?: string }) => {
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
        Send
      </ButtonIcon>
      <ModalSendBTC isShow={isShow} onHideModal={toggle} />
    </>
  );
};

export default ButtonSendBTC;
