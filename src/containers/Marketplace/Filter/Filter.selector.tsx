import s from '@containers/Marketplace/Filter/styles.module.scss';
import React from 'react';
import Text from '@components/Text';
import Checkbox from '@components/Checkbox';
import {
  IFilterInfoDetail,
  IFilterInfoItem,
} from '@interfaces/api/marketplace-btc';

interface IProps {
  value: IFilterInfoDetail;
  onClick: (name: string, value: string) => void;
  checkedValues: string[];
}

const Selector = ({ value, checkedValues, onClick }: IProps) => {
  const toggle = (name: string, value: string) => {
    onClick(name, value);
  };

  const renderItem = (item: IFilterInfoItem) => {
    const isChecked = checkedValues.some(value => value === item.value);
    return (
      <Checkbox
        id={item.name}
        label={item.name}
        checked={isChecked}
        className={s.selector_wrapBox_checkBox}
        key={item.name}
        onClick={() => {
          toggle(value.name, item.value);
        }}
      />
    );
  };

  return (
    <div className={s.selector}>
      <Text as={'label'} size={'14'} color={'black-40-solid'}>
        {value?.name}
      </Text>
      <div className={s.selector_wrapBox}>{value?.data.map(renderItem)}</div>
    </div>
  );
};

export default Selector;
