import React from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import ModalListForSale from '@components/Transactor/ButtonListForSale/Modal';
import cs from 'classnames';

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
    const toggleModal = () => setShow(value => !value);
    return (
      <>
        <ButtonIcon
          sizes={sizes}
          className={cs(`${className}`)}
          onClick={toggleModal}
        >
          {title}
        </ButtonIcon>
        <ModalListForSale
          inscriptionID={inscriptionID}
          title={title}
          isShow={isShow}
          onHide={toggleModal}
        />
      </>
    );
  }
);

ButtonListForSale.displayName = 'ButtonListForSale';

export default ButtonListForSale;
