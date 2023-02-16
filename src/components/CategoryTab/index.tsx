import React from 'react';
import s from './styles.module.scss';
import cs from 'classnames';
import Text from '@components/Text';

type Props = {
  type?: '1' | '2' | '3';
  className?: string;
  active?: boolean;
  text: string;
};

const CategoryTab = (props: Props) => {
  const { type = '1', className, active = false, text } = props;

  return (
    <div
      className={cs(
        s.tabWrapper,
        s[`default-${type}`],
        className,
        active && s.active
      )}
    >
      <Text fontWeight="medium" title={text}>
        {text}
      </Text>
    </div>
  );
};

export default CategoryTab;
