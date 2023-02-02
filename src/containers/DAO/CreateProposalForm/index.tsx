import s from './styles.module.scss';
import React from 'react';
import { Formik } from 'formik';
import { TokenType } from '@enums/token-type';

interface IFormValues {
  title: string;
  description: string;
  tokenType: TokenType;
  amount: string;
  receiverAddress: string;
}

const CreateProposalForm: React.FC = (): React.ReactElement => {
  const validateForm = (_values: IFormValues) => {
    //
  };

  const handleSubmit = (_values: IFormValues) => {
    //
  };

  return (
    <div className={s.createProposalForm}>
      <h1 className={s.formTitle}>Create Proposal</h1>
      <div className={s.createProposalForm}>
        <Formik
          key="createProposalForm"
          initialValues={{
            title: '',
            description: '',
            tokenType: TokenType.NATIVE,
            amount: '0.00',
            receiverAddress: '',
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
                  <p className={s.error}>{errors.title}</p>
                )}
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
                  <p className={s.error}>{errors.receiverAddress}</p>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProposalForm;
