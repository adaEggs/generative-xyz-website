import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import React from 'react';
import ModalReceiver from '@containers/Profile/ButtonReceiver/ModalReceiver';

interface IProps {
  className?: string;
  title?: string;
  sizes?: ButtonSizesType;
}

const ButtonReceiver = ({
  className,
  title = 'Receive inscription',
  sizes = 'large',
}: IProps) => {
  const [isShow, setShow] = React.useState(false);

  const toggle = () => setShow(value => !value);

  return (
    <>
      <ButtonIcon
        variants={'primary'}
        sizes={sizes}
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
