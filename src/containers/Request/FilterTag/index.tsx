/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Button from '@components/Button';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { DAO_TYPE } from '@constants/dao';

import { STATUS_COLLECTION, STATUS_USERS, SORT_OPTIONS } from '../Filter';
import s from './FilterTag.module.scss';

interface FilterTagProps {
  className?: string;
}

export const FilterTag = ({ className }: FilterTagProps): JSX.Element => {
  const router = useRouter();
  const {
    keyword = '',
    status = '',
    sort = '',
    id = '',
    tab = 0,
  } = router.query;
  const resetFilter = (queryParams: Record<string, string>) => {
    router.replace({ query: queryParams });
  };

  const getDisplayFilter = (
    keyFilter: string | string[] | any,
    value: string | string[]
  ): string | string[] => {
    if (keyFilter === 'status') {
      if (tab == DAO_TYPE.COLLECTION) {
        return (
          STATUS_COLLECTION.find?.(item => item.value == value)?.label ||
          STATUS_COLLECTION[0].label
        );
      }
      if (tab == DAO_TYPE.ARTIST) {
        return (
          STATUS_USERS.find?.(item => item.value == value)?.label ||
          STATUS_USERS[0].label
        );
      }
    }
    if (keyFilter === 'sort') {
      return (
        SORT_OPTIONS.find?.(item => item.value == value)?.label ||
        SORT_OPTIONS[0].label
      );
    }
    return value;
  };

  const Tag = useCallback(
    (keyFilter: string | string[] | any, value: string | string[]) => {
      return (
        <div className={s.filterTag_tag}>
          <span>{getDisplayFilter(keyFilter, value)}</span>
          <SvgInset
            size={18}
            svgUrl={`${CDN_URL}/icons/close-dao.svg`}
            onClick={() => {
              resetFilter({
                ...router.query,
                [keyFilter]: '',
              });
            }}
          />
        </div>
      );
    },
    [keyword, status, sort, id]
  );

  if ([keyword, status, sort, id].filter(item => item).length < 2) return <></>;

  return (
    <div className={cn(s.filterTag, className)}>
      {id && <>{Tag('id', id)}</>}
      {keyword && <>{Tag('keyword', keyword)}</>}
      {status && <>{Tag('status', status)}</>}
      {/* default alway sort by newest so don't need to show it */}
      {sort && sort != SORT_OPTIONS[0]?.value && <>{Tag('sort', sort)}</>}
      <Button
        className={s.filterTag_clearBtn}
        onClick={() => {
          router.replace({
            query: {},
          });
        }}
      >
        Clear all
      </Button>
    </div>
  );
};

export default React.memo(FilterTag);
