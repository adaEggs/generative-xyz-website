import React from 'react';
import s from './styles.module.scss';
import cs from 'classnames';
import Text from '@components/Text';
import Skeleton from '@components/Skeleton';

type Props = {
  type?: '1' | '2' | '3';
  className?: string;
  active?: boolean;
  text: string;
  onClick?: () => void;
  loading?: boolean;
};

const CategoryTab = (props: Props) => {
  const {
    type = '1',
    className,
    active = false,
    text,
    onClick,
    loading,
  } = props;

  if (loading)
    return (
      <>
        <Skeleton width={100} height={42} className={s.CategoryTab_sk} />
        <Skeleton width={100} height={42} className={s.CategoryTab_sk} />
        <Skeleton width={100} height={42} className={s.CategoryTab_sk} />
      </>
    );

  return (
    <div
      className={cs(
        s.tabWrapper,
        s[`default-${type}`],
        className,
        active && s.active
      )}
      onClick={onClick}
    >
      <Text fontWeight="medium" title={text}>
        {text}
      </Text>
    </div>
  );
};

export default CategoryTab;
