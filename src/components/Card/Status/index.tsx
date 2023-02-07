import { ProposalState } from '@enums/dao';
import React from 'react';
import cs from 'classnames';
import s from './styles.module.scss';

const CardStatus = ({ status }: { status: number }) => {
  return (
    <div
      className={cs(s.status, {
        [`${s.active}`]: status === ProposalState.Active,
        [`${s.pending}`]: status === ProposalState.Pending,
      })}
    >
      {ProposalState[status]}
    </div>
  );
};

export default CardStatus;
