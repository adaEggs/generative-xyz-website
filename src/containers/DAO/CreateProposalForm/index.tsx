import s from './styles.module.scss';
import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import MarkdownEditor from '@components/MarkdownEditor';
import Select, { SingleValue } from 'react-select';
import { INITIAL_FORM_VALUES, TOKEN_OPTIONS } from '@constants/dao';
import { SelectOption } from '@interfaces/select-input';
import Button from '@components/ButtonIcon';
import { validateWalletAddress } from '@utils/validate';
import { DAOContext } from '@contexts/dao-context';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { IFormValue } from '@interfaces/dao';
import { CreateProposalDisplayMode } from '@enums/dao';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';

const CreateProposalForm: React.FC = (): React.ReactElement => {
  const {
    formValues,
    setFormValues,
    setDisplayMode,
    setIsFormValid,
    handleSubmitProposal,
  } = useContext(DAOContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSwitchToPreviewMode = (isFormValid: boolean): void => {
    setDisplayMode(CreateProposalDisplayMode.PREVIEW);
    setIsFormValid(isFormValid);
  };

  const validateForm = (values: IFormValue) => {
    setFormValues({
      ...values,
    });

    const errors: Record<string, string> = {};

    if (!values.title) {
      errors.title = 'Title is required.';
    }

    if (!values.amount.toString()) {
      errors.amount = 'Funding amount is required.';
    } else if (parseFloat(values.amount) < 0) {
      errors.amount = 'Invalid number.';
    }

    if (!values.receiverAddress) {
      errors.receiverAddress = "Receiver's address is required.";
    } else if (!validateWalletAddress(values.receiverAddress)) {
      errors.receiverAddress = 'Invalid address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue) => {
    try {
      setIsSubmitting(true);
      await handleSubmitProposal(values);
      // TODO Handle navigate
    } catch (err: unknown) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={s.createProposalForm}>
      <div className="container">
        <header className={s.pageHeader}>
          <Link className={s.backLink} href={ROUTE_PATH.DAO}>
            Back
          </Link>
        </header>

        <div className={s.formWrapper}>
          <h1 className={s.formTitle}>Create Proposal</h1>
          <div className={s.createProposalForm}>
            <Formik
              key="createProposalForm"
              initialValues={{
                ...INITIAL_FORM_VALUES,
                ...formValues,
              }}
              validate={validateForm}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isValid,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="title">
                      Title <sup className={s.requiredTag}>*</sup>
                    </label>
                    <div className={s.inputContainer}>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                        className={s.input}
                        placeholder="Proposal idea"
                      />
                    </div>
                    {errors.title && touched.title && (
                      <p className={s.inputError}>{errors.title}</p>
                    )}
                  </div>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="description">
                      Description
                    </label>
                    <MarkdownEditor
                      id="description"
                      className={s.mdEditor}
                      value={values.description}
                      preview="edit"
                      visiableDragbar={false}
                      height={200}
                      onValueChange={(val: string | undefined) => {
                        if (val) setFieldValue('description', val);
                      }}
                    />
                    {errors.description && touched.description && (
                      <p className={s.inputError}>{errors.description}</p>
                    )}
                  </div>
                  <div className={s.twoCol}>
                    <div className={s.formItem}>
                      <label className={s.label} htmlFor="token">
                        Token <sup className={s.requiredTag}>*</sup>
                      </label>
                      <Select
                        id="token"
                        name="token"
                        defaultValue={TOKEN_OPTIONS[0]}
                        options={TOKEN_OPTIONS}
                        className={s.selectInput}
                        classNamePrefix="select"
                        isClearable={false}
                        isSearchable={false}
                        onChange={(op: SingleValue<SelectOption>) => {
                          setFieldValue('token', op?.value);
                        }}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className={s.formItem}>
                      <label className={s.label} htmlFor="amount">
                        Funding amount <sup className={s.requiredTag}>*</sup>
                      </label>
                      <div className={s.inputContainer}>
                        <input
                          id="amount"
                          type="number"
                          name="amount"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.amount}
                          className={s.input}
                          placeholder="Enter a number"
                        />
                      </div>
                      {errors.amount && touched.amount && (
                        <p className={s.inputError}>{errors.amount}</p>
                      )}
                    </div>
                  </div>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="receiverAddress">
                      Transfer to <sup className={s.requiredTag}>*</sup>
                    </label>
                    <div className={s.inputContainer}>
                      <input
                        id="receiverAddress"
                        type="text"
                        name="receiverAddress"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.receiverAddress}
                        className={s.input}
                        placeholder="Enter receiver’s address"
                      />
                    </div>
                    {errors.receiverAddress && touched.receiverAddress && (
                      <p className={s.inputError}>{errors.receiverAddress}</p>
                    )}
                  </div>
                  <div className={s.actionWrapper}>
                    <Button
                      disabled={isSubmitting}
                      onClick={() => handleSwitchToPreviewMode(isValid)}
                      variants="outline"
                      type="button"
                    >
                      Preview proposal
                    </Button>
                    <Button disabled={isSubmitting} type="submit">
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProposalForm;
