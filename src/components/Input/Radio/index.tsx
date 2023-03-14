import React from 'react';
import { v4 } from 'uuid';
import s from './Radio.module.scss';

type Props = {
  label?: string;
  options: { key: string; value: string }[];
  className?: string;
  name: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: string;
};

const RadioGroups = ({
  label,
  options,
  className,
  name,
  defaultValue,
  onChange,
  checked,
}: Props) => {
  return (
    <div className={className}>
      {label && <label>{label}</label>}
      <div className={s.groups}>
        {options?.map(option => {
          return (
            <div key={`${option.key}-${v4()}`} className={s.inputGroups}>
              <input
                type="radio"
                id={option.key}
                value={option.key}
                name={name}
                defaultChecked={option.key === defaultValue}
                onChange={onChange}
                checked={checked === option.key}
                // checked={field.value === option.value}
              />
              <label htmlFor={option.key}>{option.value}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroups;
