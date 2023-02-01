import s from './styles.module.scss';
import Button from '@components/ButtonIcon';
import React from 'react';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

const ProposalList: React.FC = (): React.ReactElement => {
  const router = useRouter();

  const handleNavigateToCreatePage = (): void => {
    // TODO Check wallet GEN token balance
    router.push(`${ROUTE_PATH.DAO}/create`);
  };

  return (
    <div className={s.proposalList}>
      <div className="container">
        <header className={s.header}>
          <div className={s.leftContent}>
            <h1 className={s.mainTitle}>DAO</h1>
            <p className={s.mainDescription}>[description]</p>
          </div>
          <div className={s.rightContent}>
            <Button onClick={handleNavigateToCreatePage}>
              Submit proposal
            </Button>
            <p className={s.mainDescription}>[description]</p>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ProposalList;
