import React, { useState } from 'react';
import s from './FilterMinMax.module.scss';
import Text from '@components/Text';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import { debounce } from 'lodash';
import { convertToSatoshiNumber } from '@utils/format';

type Props = {
  label?: string;
  filterPrice?: boolean;
  placeholderMin?: string;
  placeholderMax?: string;
  filter: {
    from: string;
    to: string;
  };
  setFilter: (value: { from: string; to: string }) => void;
};

const FilterMinMax = (props: Props) => {
  const {
    label,
    filterPrice = false,
    placeholderMin,
    placeholderMax,
    filter,
    setFilter,
  } = props;

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setShowDropdown(false));

  const handleMinInputChange = (value: string) => {
    if (value) {
      const _value = filterPrice ? convertToSatoshiNumber(value) : value;
      setFilter({
        ...filter,
        from: `${_value}`,
      });
    } else {
      setFilter({
        ...filter,
        from: '',
      });
    }
  };
  const handleMaxInputChange = (value: string) => {
    if (value) {
      const _value = filterPrice ? convertToSatoshiNumber(value) : value;

      setFilter({
        ...filter,
        to: `${_value}`,
      });
    } else {
      setFilter({
        ...filter,
        to: '',
      });
    }
  };

  return (
    <div className={s.wrapper} ref={dropdownRef}>
      <div
        className={s.dropdown_box}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Text color="black-40">{label}</Text>
        <SvgInset
          size={12}
          svgUrl={`${CDN_URL}/icons/ic-caret-down.svg`}
          className={s.icon}
        />
      </div>
      <div className={`${s.dropdown} ${showDropdown ? s.show : ''}`}>
        <div className={s.input_wrapper}>
          <Text fontWeight="medium" className={s.label}>
            Min
          </Text>
          <div className={s.divider}></div>
          <div className={s.input}>
            <input
              type="number"
              placeholder={placeholderMin}
              onChange={debounce(e => {
                handleMinInputChange(e.target.value);
              }, 1000)}
            />
            {filterPrice && (
              <Text size="14" color="black-60">
                BTC
              </Text>
            )}
          </div>
        </div>
        <div className={s.input_wrapper}>
          <Text fontWeight="medium" className={s.label}>
            Max
          </Text>
          <div className={s.divider}></div>
          <div className={s.input}>
            <input
              type="number"
              placeholder={placeholderMax}
              onChange={debounce(e => {
                handleMaxInputChange(e.target.value);
              }, 1000)}
            />
            {filterPrice && (
              <Text size="14" color="black-60">
                BTC
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMinMax;
