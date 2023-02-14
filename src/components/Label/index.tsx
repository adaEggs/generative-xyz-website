import React from 'react';
import s from './styles.module.scss';

export const Label = ({
  label,
  vars,
}: {
  label: string;
  vars: 'blue';
}): JSX.Element => {
  return (
    <>
      <span className={`${s.label} ${s[`label__${vars}`]} label_text`}>
        {label}
      </span>
    </>
  );
};
