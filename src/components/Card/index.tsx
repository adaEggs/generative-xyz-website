import React, { ReactNode } from 'react';
import s from './styles.module.scss';
import { Stack } from 'react-bootstrap';
import Heading from '@components/Heading';

type Props = {
  heading?: string;
  body: ReactNode;
  status?: 'active' | 'pending' | 'closed';
};

const Card = (props: Props) => {
  const { heading, body, status } = props;

  return (
    <div className={s.Card_wrapper}>
      <Stack direction="horizontal" className="justify-between">
        <Heading as="h4">{heading}</Heading>
        {status && <div className={s.Card_status}>{status}</div>}
      </Stack>
      {body}
    </div>
  );
};

export default Card;
