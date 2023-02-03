import Skeleton from '@components/Skeleton';
import { DAOContext } from '@contexts/dao-context';
import React, { useContext, useState } from 'react';
import Button from '@components/ButtonIcon';
import s from './styles.module.scss';
import { CreateProposalDisplayMode } from '@enums/dao';
import MarkdownPreview from '@components/MarkdownPreview';
import toast from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { IFormValue } from '@interfaces/dao';

const ProposalPreview: React.FC = (): React.ReactElement => {
  const { formValues, isFormValid, setDisplayMode, handleSubmitProposal } =
    useContext(DAOContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSwitchToEditMode = (): void => {
    setDisplayMode(CreateProposalDisplayMode.INPUT_INFO);
  };

  const handleSubmitForm = async (): Promise<void> => {
    if (!isFormValid) {
      toast.error('Form data is invalid. Please check your inputs.');
      return;
    }

    try {
      setIsSubmitting(true);
      await handleSubmitProposal(formValues as IFormValue);
      // TODO Handle navigate
    } catch (err: unknown) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={s.proposalPreview}>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            {formValues.title ? (
              <h1 className={s.title}>{formValues.title}</h1>
            ) : (
              <div className={s.titleSkeleton}>
                <Skeleton fill />
              </div>
            )}
            {formValues.description ? (
              <div className={s.description}>
                <p className={s.descriptionLabel}>Description</p>
                <MarkdownPreview source={formValues.description} />
              </div>
            ) : (
              <>
                <div className={s.descriptionLabelSkeleton}>
                  <Skeleton fill />
                </div>
                <div className={s.descriptionSkeleton}>
                  <Skeleton fill />
                </div>
              </>
            )}
          </div>
          <div className="col-md-3 offset-md-1">
            <div className={s.summaryWrapper}>
              <h2 className={s.sectionTitle}>Summary</h2>
              <div className={s.summaryInfoList}>
                <div className={s.summaryInfoItem}>
                  <span className={s.summaryLabel}>Funding amount</span>
                  <span className={s.summaryValue}>Funding amount</span>
                </div>
                <div className={s.summaryInfoItem}>
                  <span className={s.summaryLabel}>Funding amount</span>
                  <span className={s.summaryValue}>Funding amount</span>
                </div>
                <div className={s.summaryInfoItem}>
                  <span className={s.summaryLabel}>Funding amount</span>
                  <span className={s.summaryValue}>Funding amount</span>
                </div>
              </div>
              <div className={s.actionWrapper}>
                <Button
                  disabled={isSubmitting}
                  onClick={handleSwitchToEditMode}
                  variants="outline"
                  type="button"
                >
                  Back to edit
                </Button>
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmitForm}
                  type="button"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreview;
