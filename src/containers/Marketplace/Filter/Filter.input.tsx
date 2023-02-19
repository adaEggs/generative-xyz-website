import s from '@containers/Marketplace/Filter/styles.module.scss';
import Image from 'next/image';
import { CDN_URL } from '@constants/config';
import debounce from 'lodash/debounce';
import React from 'react';

interface IProps {
  onKeyWordChange: (key: string) => void;
}

const Input = ({ onKeyWordChange }: IProps) => {
  return (
    <div className={s.inputWrapper}>
      <div className={s.inputPrefixWrapper}>
        <Image
          src={`${CDN_URL}/icons/ic-search-14x14.svg`}
          width={20}
          height={20}
          alt="ic-triangle-exclamation"
        />
      </div>
      <input
        defaultValue=""
        onChange={debounce(e => {
          onKeyWordChange(e.target.value);
        }, 300)}
        className={s.input}
        placeholder="Search by inscription ID"
        type="text"
      />
    </div>
  );
};

export default Input;
