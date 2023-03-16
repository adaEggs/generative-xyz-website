import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import s from './SubmitDaoButton.module.scss';

interface SubmitDaoButtonProps {
  className?: string;
  currentTabActive: number;
}

export const SubmitDaoButton = ({
  className,
  currentTabActive,
}: SubmitDaoButtonProps): JSX.Element => {
  const router = useRouter();
  const { status = '', sort = '' } = router.query;

  return <div className={cn(s.SubmitDaoButton, className)}></div>;
};

export default React.memo(SubmitDaoButton);
