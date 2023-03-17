/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Select, { SingleValue } from 'react-select';
import debounce from 'lodash/debounce';

import { SelectOption } from '@interfaces/select-input';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';
import { ProposalStatus, ProposalUserStatus } from '@enums/dao';
import { DAO_TYPE } from '@constants/dao';

import s from './Filter.module.scss';

interface FilterProps {
  className?: string;
  currentTabActive: number;
}

export const STATUS_COLLECTION: Array<{
  value: number | string;
  label: string;
}> = [
  {
    value: '',
    label: 'Show all',
  },
  {
    value: ProposalStatus.Voting,
    label: 'Voting',
  },
  {
    value: ProposalStatus.Executed,
    label: 'Executed',
  },
  {
    value: ProposalStatus.Defeated,
    label: 'Defeated',
  },
];

export const STATUS_USERS: Array<{ value: number | string; label: string }> = [
  {
    value: '',
    label: 'Show all',
  },
  {
    value: ProposalUserStatus.Verifying,
    label: 'Verifying',
  },
  {
    value: ProposalUserStatus.Verified,
    label: 'Verified',
  },
];

export const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: '_id,desc',
    label: 'Sort by: Newest',
  },
  {
    value: '_id,asc',
    label: 'Sort by: Oldest',
  },
];

export const Filter = ({
  className,
  currentTabActive,
}: FilterProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '', status = '', sort = '' } = router.query;

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<any>(null);
  const sortRef = useRef<any>(null);

  useEffect(() => {
    if (inputSearchRef?.current) {
      inputSearchRef.current.value = keyword as string;
    }
  }, [keyword]);

  const getValueStatus = (newStatus: string | string[]) => {
    if (currentTabActive === DAO_TYPE.COLLECTION) {
      return (
        STATUS_COLLECTION.find(item => item.value == newStatus) ||
        STATUS_COLLECTION[0]
      );
    }
    return (
      STATUS_USERS.find(item => item.value == newStatus) || STATUS_USERS[0]
    );
  };

  useEffect(() => {
    statusRef?.current?.setValue(getValueStatus(status));
  }, [status]);

  const getValueSort = (newSort: string | string[]) => {
    return SORT_OPTIONS.find(item => item.value == newSort) || SORT_OPTIONS[0];
  };

  useEffect(() => {
    sortRef?.current?.setValue(getValueSort(sort));
  }, [sort]);

  return (
    <div className={cn(s.filter, className)}>
      <div className={s.filter_search}>
        <input
          ref={inputSearchRef}
          name="search"
          type="text"
          id="request-keyword"
          placeholder={
            currentTabActive === DAO_TYPE.COLLECTION
              ? 'collection, artist'
              : 'artists'
          }
          onChange={debounce(e => {
            router.replace({
              query: {
                ...router.query,
                keyword: e?.target?.value?.trim(),
              },
            });
          }, 300)}
        />
        <div className={s.filter_searchIcon}>
          <label htmlFor="request-keyword">
            <SvgInset
              size={20}
              svgUrl={`${CDN_URL}/icons/ic-search-14x14.svg`}
            />
          </label>{' '}
        </div>
      </div>
      <div className={s.filter_status}>
        <Select
          ref={statusRef}
          isSearchable={false}
          isClearable={false}
          options={
            currentTabActive === DAO_TYPE.COLLECTION
              ? STATUS_COLLECTION
              : STATUS_USERS
          }
          className={cn('select-input', s.filter_select)}
          classNamePrefix="select"
          onChange={op => {
            if (op) {
              router.replace({
                query: { ...router.query, status: op.value },
              });
            }
          }}
        />
      </div>
      <div className={s.filter_sort}>
        <Select
          ref={sortRef}
          isSearchable={false}
          isClearable={false}
          options={SORT_OPTIONS}
          className={cn('select-input', s.filter_select)}
          classNamePrefix="select"
          onChange={(op: SingleValue<SelectOption>) => {
            if (op && op.value !== sort) {
              router.replace({
                query: { ...router.query, sort: op.value },
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Filter);
