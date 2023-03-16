import React from 'react';
import Text from '@components/Text';
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
        {options?.map((option, index) => {
          return (
            <div key={`${option.key}-${index}`} className={s.inputGroups}>
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
              <Text as={'label'} size="16" htmlFor={option.key}>
                {option.value}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroups;
