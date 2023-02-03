import { DAOContext, DAOContextProvider } from '@contexts/dao-context';
import { CreateProposalDisplayMode } from '@enums/dao';
import React, { useContext } from 'react';
import CreateProposalForm from '../CreateProposalForm';
import ProposalPreview from '../ProposalPreview';
import s from './styles.module.scss';

const CreateProposal: React.FC = (): React.ReactElement => {
  const { displayMode } = useContext(DAOContext);

  return (
    <div className={s.createProposal}>
      <div className={s.mainContent}>
        {displayMode === CreateProposalDisplayMode.INPUT_INFO && (
          <CreateProposalForm />
        )}
        {displayMode === CreateProposalDisplayMode.PREVIEW && (
          <ProposalPreview />
        )}
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
