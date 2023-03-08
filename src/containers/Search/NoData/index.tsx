import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

import s from './NoData.module.scss';

interface NoDataProps {
  className?: string;
}

export const NoData = ({ className }: NoDataProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;

  return (
    <div className={cn(s.noData, className)}>
      <div className={s.noData_icon}>
        <SvgInset svgUrl={`${CDN_URL}/icons/sad-face.svg`} />
      </div>
      <div className={s.noData_text}>
        No results for &quot;
        <span className={s.noData_keyword}>{keyword}</span>
        &quot;.Try another search?
      </div>
    </div>
  );
};

export default React.memo(NoData);
