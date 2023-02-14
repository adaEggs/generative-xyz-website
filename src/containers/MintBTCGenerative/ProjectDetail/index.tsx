import s from './styles.module.scss';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { useRouter } from 'next/router';
import UploadThumbnailButton from '../UploadThumbnailButton';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';

type IProductDetailFormValue = {
  name: string;
  description: string;
};

const ProjectDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    thumbnailFile,
    setShowErrorAlert,
    currentStep,
  } = useContext(MintBTCGenerativeContext);

  const validateForm = (
    _formValues: IProductDetailFormValue
  ): Record<string, string> => {
    // Update data
    setFormValues({
      ...formValues,
      ..._formValues,
    });

    const errors: Record<string, string> = {};

    if (!_formValues.name) {
      errors.name = 'Name is required';
    }

    if (!_formValues.description) {
      errors.description = 'Description is required';
    }

    return errors;
  };

  const handleSubmit = (_formValues: IProductDetailFormValue): void => {
    if (!thumbnailFile) {
      setShowErrorAlert({
        open: true,
        message: 'Thumbnail image is required. ',
      });
      return;
    }
    router.push('/create/set-price', undefined, { shallow: true });
  };

  return (
    <Formik
      key="projectDetailForm"
      initialValues={{
        name: formValues.name ?? '',
        description: formValues.description ?? '',
      }}
      validate={validateForm}
      onSubmit={handleSubmit}
      validateOnChange
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
        <form onSubmit={handleSubmit} className={s.projectDetail_form}>
          <div className={s.projectDetail}>
            <div>
              <div className={s.formWrapper}>
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="name">
                    Name of collection <sup className={s.requiredTag}>*</sup>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className={s.input}
                    placeholder="Give your collection a name that’s easy to remember."
                  />
                  {errors.name && touched.name && (
                    <p className={s.error}>{errors.name}</p>
                  )}
                </div>
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="tokenDescription">
                    Description of your collection&nbsp;
                    <sup className={s.requiredTag}>*</sup>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    className={s.input}
                    rows={4}
                    placeholder="Tell us more about the meaning and inspiration behind your art."
                  />
                  {errors.description && touched.description && (
                    <p className={s.error}>{errors.description}</p>
                  )}
                </div>
              </div>
              <div className={s.uploadPreviewWrapper}>
                {currentStep > 1 && currentStep < 3 && (
                  <UploadThumbnailButton />
                )}
              </div>
            </div>

            <div className={s.container}>
              <div className={s.actionWrapper}>
                <Button
                  type="submit"
                  className={s.nextBtn}
                  endIcon={
                    <SvgInset
                      svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                    />
                  }
                >
                  Next step
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ProjectDetail;
