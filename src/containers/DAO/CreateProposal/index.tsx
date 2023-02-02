import Button from '@components/ButtonIcon';
import { DAOContext, DAOContextProvider } from '@contexts/dao-context';
import { CreateDAOProposalStep } from '@enums/dao';
import React, { useContext } from 'react';
import CreateProposalForm from '../CreateProposalForm';
import ProposalPreview from '../ProposalPreview';
import s from './styles.module.scss';

const CreateProposal: React.FC = (): React.ReactElement => {
  const {
    currentStep,
    handleDelegateGENToken,
    handleExecuteProposal,
    handleCastVote,
    handleSubmitProposal,
  } = useContext(DAOContext);

  return (
    <div className={s.createProposal}>
      <header>
        <div className="container">
          <Button>Back</Button>
        </div>
      </header>
      <div className={s.mainContent}>
        {currentStep === CreateDAOProposalStep.INPUT_INFO && (
          <CreateProposalForm />
        )}
        {currentStep === CreateDAOProposalStep.PREVIEW_INFO && (
          <ProposalPreview />
        )}
      </div>
      <div>
        <Button onClick={handleDelegateGENToken}>Delegate</Button>
        <Button onClick={handleSubmitProposal}>Submit proposal</Button>
        <Button onClick={handleCastVote}>Vote FOR</Button>
        <Button onClick={handleExecuteProposal}>Execute proposal</Button>
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
