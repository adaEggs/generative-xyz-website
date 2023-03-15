import React from 'react';
import cn from 'classnames';

import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

import s from './NoData.module.scss';

interface NoDataProps {
  className?: string;
}

export const NoData = ({ className }: NoDataProps): JSX.Element => {
  return (
    <div className={cn(s.noData, className)}>
      <div className={s.noData_icon}>
        <SvgInset svgUrl={`${CDN_URL}/icons/sad-face.svg`} />
      </div>
      <div className={s.noData_text}>No data.</div>
    </div>
  );
};

export default React.memo(NoData);
