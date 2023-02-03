import { DAOContext, DAOContextProvider } from '@contexts/dao-context';
import { CreateDAOProposalStep } from '@enums/dao';
import React, { useContext } from 'react';
import CreateProposalForm from '../CreateProposalForm';
import ProposalPreview from '../ProposalPreview';
import Link from '@components/Link';
import s from './styles.module.scss';
import { ROUTE_PATH } from '@constants/route-path';

const CreateProposal: React.FC = (): React.ReactElement => {
  const { currentStep } = useContext(DAOContext);

  return (
    <div className={s.createProposal}>
      <div className="container">
        <header className={s.pageHeader}>
          <Link className={s.backLink} href={ROUTE_PATH.DAO}>
            Back
          </Link>
        </header>
        <div className={s.mainContent}>
          {currentStep === CreateDAOProposalStep.INPUT_INFO && (
            <CreateProposalForm />
          )}
          {currentStep === CreateDAOProposalStep.PREVIEW_INFO && (
            <ProposalPreview />
          )}
        </div>
      </div>
    </div>
  );
};

const CreateProposalWrapper: React.FC = (): React.ReactElement => {
  return (
    <DAOContextProvider>
      <CreateProposal />
    </DAOContextProvider>
  );
};

export default CreateProposalWrapper;
