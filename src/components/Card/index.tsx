import React, { ReactNode } from 'react';
import s from './styles.module.scss';
import { Stack } from 'react-bootstrap';
import Heading from '@components/Heading';
import cs from 'classnames';
import CardStatus from './Status';
import Skeleton from '@components/Skeleton';

type Props = {
  heading?: string;
  children?: ReactNode;
  status?: number;
  className?: string;
  isLoading?: boolean;
};

const Card = (props: Props) => {
  const { heading, children, status, className, isLoading } = props;

  if (isLoading)
    return (
      <div className={cs(s.Card_wrapper, className)}>
        <Skeleton height={44} width={400} />
        <div className={s.Card_desc_skeleton}>
          <Skeleton height={44} width={500} />
          <Skeleton height={44} width={400} />
          <Skeleton height={44} width={200} />
        </div>
      </div>
    );

  return (
    <div className={cs(s.Card_wrapper, className)}>
      {status ? (
        <Stack direction="horizontal" className="justify-between" gap={3}>
          <Heading as="h4" className={s.Card_heading}>
            {heading}
          </Heading>
          <CardStatus status={status} />
        </Stack>
      ) : (
        <Heading as="h4" className={s.Card_heading}>
          {heading}
        </Heading>
      )}

      {children}
    </div>
  );
};

export default Card;
