import s from './styles.module.scss';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { useRouter } from 'next/router';
import UploadThumbnailButton from '../UploadThumbnailButton';
import { MintBTCGenerativeContext } from '@contexts/mint-btc-generative-context';
import useAsyncEffect from 'use-async-effect';
import { SelectOption } from '@interfaces/select-input';
import { getCategoryList } from '@services/category';
import Select, { MultiValue } from 'react-select';
import MarkdownEditor from '@components/MarkdownEditor';
import { CollectionType } from '@enums/mint-generative';

type IProductDetailFormValue = {
  name: string;
  description: string;
  categories: Array<SelectOption>;
  captureImageTime: number;
};

const ProjectDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    thumbnailFile,
    setShowErrorAlert,
    currentStep,
    collectionType,
  } = useContext(MintBTCGenerativeContext);
  const [categoryOptions, setCategoryOptions] = useState<Array<SelectOption>>(
    []
  );

  const validateForm = (
    _formValues: IProductDetailFormValue
  ): Record<string, string> => {
    // Update data
    setFormValues({
      ...formValues,
      ..._formValues,
      categories: _formValues.categories
        ? _formValues.categories.map(cat => cat.value)
        : [],
    });

    const errors: Record<string, string> = {};

    if (!_formValues.name) {
      errors.name = 'Name is required';
    }

    if (!_formValues.description) {
      errors.description = 'Description is required';
    }
    if (!_formValues.captureImageTime) {
      errors.captureImageTime = 'Capture time is required';
    }
    if (_formValues.captureImageTime && _formValues.captureImageTime < 7) {
      errors.captureImageTime = 'Capture time must be greater than 7 seconds';
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

  useAsyncEffect(async () => {
    const { result } = await getCategoryList();
    const options = result.map(item => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    setCategoryOptions(options.filter(op => op.label !== 'Ethereum'));
  }, []);

  return (
    <Formik
      key="projectDetailForm"
      initialValues={{
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        categories: formValues.categories
          ? formValues.categories.map(cat => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return categoryOptions.find(op => cat === op.value)!;
            })
          : [],
        captureImageTime: formValues.captureImageTime ?? 20,
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
        setFieldValue,
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
                  {/*<textarea*/}
                  {/*  id="description"*/}
                  {/*  name="description"*/}
                  {/*  onChange={handleChange}*/}
                  {/*  onBlur={handleBlur}*/}
                  {/*  value={values.description}*/}
                  {/*  className={s.input}*/}
                  {/*  rows={4}*/}
                  {/*  placeholder="Tell us more about the meaning and inspiration behind your art."*/}
                  {/*/>*/}
                  <MarkdownEditor
                    id="description"
                    className={s.mdEditor}
                    value={values.description}
                    onBlur={handleBlur}
                    preview="edit"
                    visiableDragbar={false}
                    height={200}
                    onValueChange={(val: string | undefined) => {
                      if (typeof val !== undefined)
                        setFieldValue('description', val);
                    }}
                  />
                  {errors.description && touched.description && (
                    <p className={s.error}>{errors.description}</p>
                  )}
                </div>
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="categories">
                    Categories
                  </label>
                  <Select
                    id="categories"
                    isMulti
                    name="categories"
                    options={categoryOptions}
                    className={s.selectInput}
                    classNamePrefix="select"
                    isOptionDisabled={() => values.categories.length >= 3}
                    onChange={(ops: MultiValue<SelectOption>) => {
                      setFieldValue('categories', ops);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select categories"
                  />
                </div>
              </div>
              <div className={s.uploadPreviewWrapper}>
                {currentStep > 1 && currentStep < 3 && (
                  <UploadThumbnailButton />
                )}
              </div>
              {collectionType === CollectionType.GENERATIVE && (
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="captureImageTime">
                    Capture time (seconds)
                    <sup className={s.requiredTag}>*</sup>
                  </label>
                  <input
                    id="captureImageTime"
                    type="number"
                    name="captureImageTime"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.captureImageTime}
                    className={s.input}
                    placeholder="Please set the captureImageTime time."
                  />
                  {errors.captureImageTime && touched.captureImageTime && (
                    <p className={s.error}>{errors.captureImageTime}</p>
                  )}
                </div>
              )}
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
