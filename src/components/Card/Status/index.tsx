import { ProposalState } from '@enums/dao';
import React from 'react';
import cs from 'classnames';
import s from './styles.module.scss';

const CardStatus = ({ status }: { status: number }) => {
  switch (status) {
    case ProposalState.Active:
      return <div className={cs(s.status, s.active)}>Active</div>;

    case ProposalState.Pending:
      return <div className={cs(s.status, s.pending)}>Pending</div>;

    default:
      return <div className={s.status}>{ProposalState[status]}</div>;
  }
};

export default CardStatus;
