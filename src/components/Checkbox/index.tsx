import React, { useState } from 'react';
import Text from '@components/Text';
import cs from 'classnames';
import styles from './styles.module.scss';

type CheckboxProps = {
  id: string;
  label: string | number | boolean;
  checked?: boolean;
  onClick?: () => void;
} & React.HTMLProps<HTMLInputElement>;

const Checkbox = ({
  id,
  label,
  checked,
  onClick,
  className = '',
  ...props
}: CheckboxProps) => {
  const defaultChecked = checked ? checked : false;

  const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <div className={cs(styles.wrapper, className)}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked((prev: boolean) => !prev)}
        onClick={onClick}
        {...props}
      />
      <Text as={'label'} size={'18'} color={'black-60'} htmlFor={id}>
        {label}
      </Text>
    </div>
  );
};

export default Checkbox;
