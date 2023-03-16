import NextLink from 'next/link';
import { PropsWithChildren } from 'react';
import cs from 'classnames';
import s from './styles.module.scss';

type LinkProps = {
  onClick?: () => void;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  rest?: HTMLAnchorElement;
  isKeepDefaultEvent?: boolean;
};

export default function Link({
  onClick,
  children,
  className,
  href,
  target,
  rel,
  isKeepDefaultEvent,
  ...rest
}: PropsWithChildren<LinkProps>) {
  return (
    <NextLink
      href={href}
      onClick={
        onClick
          ? e => {
              if (!isKeepDefaultEvent) {
                e.preventDefault();
              }
              onClick();
            }
          : undefined
      }
      target={target}
      className={cs(s.link, className)}
      rel={rel}
      {...rest}
      passHref
    >
      {children}
    </NextLink>
  );
}
