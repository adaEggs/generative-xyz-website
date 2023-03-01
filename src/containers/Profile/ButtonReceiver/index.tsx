import ButtonIcon from '@components/ButtonIcon';
import React from 'react';
import ModalReceiver from '@containers/Profile/ButtonReceiver/ModalReceiver';

interface IProps {
  className?: string;
  title?: string;
}

const ButtonReceiver = ({
  className,
  title = 'Receive inscription',
}: IProps) => {
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
        {title}
      </ButtonIcon>
      <ModalReceiver isShow={isShow} onHideModal={toggle} title={title} />
    </>
  );
};

export default ButtonReceiver;
