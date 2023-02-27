import ButtonIcon from '@components/ButtonIcon';
import React from 'react';
import ModalReceiver from '@containers/Profile/ButtonReceiver/ModalReceiver';

const ButtonReceiver = ({ className }: { className?: string }) => {
  const [isShow, setShow] = React.useState(false);

  const toggle = () => setShow(value => !value);

  return (
    <>
      <ButtonIcon
        variants={'primary'}
        sizes={'large'}
        onClick={toggle}
        className={`${className}`}
      >
        Receive inscription
      </ButtonIcon>
      <ModalReceiver isShow={isShow} onHideModal={toggle} />
    </>
  );
};

export default ButtonReceiver;
