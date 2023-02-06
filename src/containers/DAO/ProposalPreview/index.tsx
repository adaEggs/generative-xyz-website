import Skeleton from '@components/Skeleton';
import { DAOContext } from '@contexts/dao-context';
import React, { useContext, useMemo, useState } from 'react';
import Button from '@components/ButtonIcon';
import s from './styles.module.scss';
import { CreateProposalDisplayMode } from '@enums/dao';
import MarkdownPreview from '@components/MarkdownPreview';
import toast from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { IFormValue } from '@interfaces/dao';
import { TokenType } from '@enums/token-type';
import { getChainCurrency } from '@utils/chain';
import { formatCurrency } from '@utils/format';
import { APP_TOKEN_SYMBOL } from '@constants/config';

const ProposalPreview: React.FC = (): React.ReactElement => {
  const { formValues, isFormValid, setDisplayMode, handleSubmitProposal } =
    useContext(DAOContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fundingAmount = useMemo((): string => {
    const currency =
      formValues.tokenType === TokenType.ERC20
        ? APP_TOKEN_SYMBOL
        : getChainCurrency();
    return `${formatCurrency(
      parseFloat(formValues.amount ?? '0')
    )} ${currency}`;
  }, [formValues.amount, formValues.tokenType]);

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
      await handleSubmitProposal({
        ...formValues,
        amount: formValues.amount?.toString(),
      } as IFormValue);
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
          <div className="col-xl-8">
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
          <div className="col-xl-3 offset-xl-1">
            <div className={s.summaryWrapper}>
              <h2 className={s.sectionTitle}>Summary</h2>
              <div className={s.summaryInfoList}>
                <div className={s.summaryInfoItem}>
                  <span className={s.summaryLabel}>Funding amount</span>
                  <span className={s.summaryValue}>{fundingAmount}</span>
                </div>
                <div className={s.summaryInfoItem}>
                  <span className={s.summaryLabel}>Voting duration</span>
                  <span className={s.summaryValue}>7 days</span>
                </div>
              </div>
              <div className={s.actionWrapper}>
                <Button
                  className={s.actionBtn}
                  disabled={isSubmitting}
                  onClick={handleSwitchToEditMode}
                  variants="outline"
                  type="button"
                >
                  Back to edit
                </Button>
                <Button
                  className={s.actionBtn}
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
