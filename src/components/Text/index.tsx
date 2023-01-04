import React, { CSSProperties, PropsWithChildren } from 'react';
import s from './styles.module.scss';
import cs from 'classnames';

type TText = {
  as?: 'p' | 'span' | 'strong' | 'em' | 'sub' | 'h2' | 'h3' | 'h4';
  fontWeight?: 'bold' | 'semibold' | 'medium' | 'regular' | 'light';
  style?: CSSProperties;
  size?: '12' | '14' | '16' | '18' | '24' | 'd1' | 'd2' | 'd3';
  color?: string;
  className?: string;
};

const Text = ({
  as = 'p',
  children,
  fontWeight = 'regular',
  size = '16',
  style,
  color,
  className,
  ...props
}: PropsWithChildren<TText>) => {
  const Text = as;

  return (
    <Text
      {...props}
      className={cs(
        s.text,
        s[`size-${size}`],
        `font-${fontWeight}`,
        `text-${color}`,
        className
      )}
      style={{ ...style }}
    >
      {children}
    </Text>
  );
};

export default Text;
