import Heading from '@components/Heading';
import Skeleton from '@components/Skeleton';
import cs from 'classnames';
import { PropsWithChildren } from 'react';
import { Stack } from 'react-bootstrap';
import CardStatus from './Status';
import s from './styles.module.scss';

type Props = {
  heading?: string;
  status?: number;
  className?: string;
  isLoading?: boolean;
};

const Card = (props: PropsWithChildren<Props>) => {
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
      <Stack direction="horizontal" className="justify-between" gap={3}>
        <Heading as="h4" className={s.Card_heading}>
          {heading}
        </Heading>
        {status && <CardStatus status={status} />}
      </Stack>
      {children}
    </div>
  );
};

export default Card;
