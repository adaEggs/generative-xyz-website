import React, { useMemo } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Select, { SingleValue } from 'react-select';
import debounce from 'lodash/debounce';

import { SelectOption } from '@interfaces/select-input';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';
import { ProposalStatus } from '@enums/dao';
import { DAO_TYPE } from '@constants/dao';

import s from './Filter.module.scss';

interface FilterProps {
  className?: string;
  currentTabActive: number;
}

const STATUS_COLLECTION: Array<{ value: number | string; label: string }> = [
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

const STATUS_USERS: Array<{ value: number | string; label: string }> = [
  {
    value: '',
    label: 'Show all',
  },
  {
    value: 0,
    label: 'Verifying',
  },
  {
    value: 1,
    label: 'Verified',
  },
];

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: 'asc',
    label: 'Sort by: Newest',
  },
  {
    value: 'desc',
    label: 'Sort by: Latest',
  },
];

export const Filter = ({
  className,
  currentTabActive,
}: FilterProps): JSX.Element => {
  const router = useRouter();
  const { status = '', sort = '' } = router.query;

  const defaultValueStatus = useMemo(() => {
    if (currentTabActive === DAO_TYPE.COLLECTION) {
      return (
        STATUS_COLLECTION.find(item => item.value === status) ||
        STATUS_COLLECTION[0]
      );
    }
    return STATUS_USERS.find(item => item.value === status) || STATUS_USERS[0];
  }, [status]);

  const defaultValueSort = useMemo(() => {
    return SORT_OPTIONS.find(item => item.value === sort) || SORT_OPTIONS[0];
  }, [sort]);

  return (
    <div className={cn(s.filter, className)}>
      <div className={s.filter_search}>
        <input
          name="search"
          type="text"
          id="request-keyword"
          placeholder={
            currentTabActive === DAO_TYPE.COLLECTION ? 'collection' : 'artists'
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
          isSearchable={false}
          isClearable={false}
          defaultValue={defaultValueStatus}
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
          isSearchable={false}
          isClearable={false}
          defaultValue={defaultValueSort}
          options={SORT_OPTIONS}
          className={cn('select-input', s.filter_select)}
          classNamePrefix="select"
          onChange={(op: SingleValue<SelectOption>) => {
            if (op) {
              router.replace({
                query: { ...router.query, sort: `_id,${op.value}` },
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Filter);
