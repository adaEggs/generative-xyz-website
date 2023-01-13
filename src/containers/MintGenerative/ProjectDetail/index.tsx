import s from './styles.module.scss';
import { Formik } from 'formik';
import React, { useContext, useMemo, useState } from 'react';
// import TagsInput from 'react-tagsinput';
import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Select, { MultiValue } from 'react-select';
import useAsyncEffect from 'use-async-effect';
import { getCategoryList } from '@services/category';
import { MintGenerativeContext } from '@contexts/mint-generative-context';
import { useRouter } from 'next/router';
import { SelectOption } from '@interfaces/select-input';
import { THIRD_PARTY_SCRIPTS } from '@constants/mint-generative';
import UploadThumbnailButton from '../UploadThumbnailButton';

type IProductDetailFormValue = {
  name: string;
  categories: Array<SelectOption>;
  description: string;
  tokenDescription: string;
  tags: Array<string>;
  thirdPartyScripts: Array<SelectOption>;
};

const ProjectDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const {
    formValues,
    setFormValues,
    thumbnailFile,
    setShowErrorAlert,
    currentStep,
  } = useContext(MintGenerativeContext);
  const [categoryOptions, setCategoryOptions] = useState<Array<SelectOption>>(
    []
  );

  const thirdPartyDefaultValue = useMemo(() => {
    return THIRD_PARTY_SCRIPTS.filter(option =>
      formValues.thirdPartyScripts?.includes(option.value)
    );
  }, [formValues.thirdPartyScripts]);

  useAsyncEffect(async () => {
    const { result } = await getCategoryList({ page: 1, limit: 100 });
    const options = result.map(item => ({
      value: item.id,
      label: item.name,
    }));
    setCategoryOptions(options);
  }, []);

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
      thirdPartyScripts: _formValues.thirdPartyScripts
        ? _formValues.thirdPartyScripts.map(lib => lib.value)
        : [],
    });

    const errors: Record<string, string> = {};

    if (!_formValues.name) {
      errors.name = 'Name is required';
    }

    if (!_formValues.description) {
      errors.description = 'Description is required';
    }

    // if (!_formValues.tokenDescription) {
    //   errors.tokenDescription = 'Token description is required';
    // }

    // if (!_formValues.tags.length) {
    //   errors.tags = 'Hashtag is required';
    // }

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
    router.push('/mint-generative/set-price', undefined, { shallow: true });
  };

  return (
    <Formik
      key="projectDetailForm"
      initialValues={{
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tokenDescription: '',
        tags: formValues.tags ?? [],
        categories: formValues.categories
          ? formValues.categories.map(cat => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return categoryOptions.find(op => cat === op.value)!;
            })
          : [],
        thirdPartyScripts: formValues.thirdPartyScripts
          ? formValues.thirdPartyScripts.map(lib => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return THIRD_PARTY_SCRIPTS.find(script => lib === script.value)!;
            })
          : [],
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
        setFieldValue,
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
                    placeholder="Provide a detailed description of your item."
                  />
                  {errors.name && touched.name && (
                    <p className={s.error}>{errors.name}</p>
                  )}
                </div>
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="tokenDescription">
                    Description of you collection{' '}
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
                {/* <div className={s.formItem}>
                <label className={s.label} htmlFor="description">
                  Collected NFTs description{' '}
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
                  placeholder="Provide a detailed description of your item."
                />
                {errors.description && touched.description && (
                  <p className={s.error}>{errors.description}</p>
                )}
              </div> */}
                <div className={s.formItem}>
                  <label className={s.label} htmlFor="thirdPartyScripts">
                    Library used
                  </label>
                  <Select
                    id="thirdPartyScripts"
                    isMulti
                    name="thirdPartyScripts"
                    options={THIRD_PARTY_SCRIPTS}
                    defaultValue={thirdPartyDefaultValue}
                    className={s.selectInput}
                    classNamePrefix="select"
                    onChange={(val: MultiValue<SelectOption>) => {
                      setFieldValue('thirdPartyScripts', val);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select library"
                  />
                </div>
                {/* <div className={s.formItem}>
                <label className={s.label} htmlFor="tags">
                  Hashtag
                </label>
                <TagsInput
                  inputProps={{
                    id: 'tags',
                    name: 'tags',
                    onBlur: handleBlur,
                    placeholder: 'Tag here',
                  }}
                  onChange={(tags: Array<string>) => {
                    setFieldValue('tags', tags);
                  }}
                  value={values.tags}
                  className={s.input}
                  renderLayout={(tagElements, inputElement) => {
                    return (
                      <span className={s.tagsWrapper}>
                        {tagElements}
                        {inputElement}
                      </span>
                    );
                  }}
                  renderTag={props => {
                    const {
                      tag,
                      key,
                      disabled,
                      onRemove,
                      getTagDisplayValue,
                      ...other
                    } = props;
                    return (
                      <span key={key} {...other} className={s.tagItem}>
                        {getTagDisplayValue(tag)}
                        {!disabled && (
                          <span
                            className={s.removeTagBtn}
                            onClick={() => onRemove(key)}
                          >
                            <svg
                              height="14"
                              width="14"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                            </svg>
                          </span>
                        )}
                      </span>
                    );
                  }}
                  renderInput={props => {
                    const { onChange, value, ...other } = props;
                    return (
                      <input
                        type="text"
                        onChange={onChange}
                        value={value}
                        {...other}
                        className={s.tagInput}
                      />
                    );
                  }}
                />
                {errors.tags && touched.tags && (
                  <p className={s.error}>{errors.tags}</p>
                )}
              </div>
              <div className={s.formItem}>
                <label className={s.label} htmlFor="category">
                  Category
                </label>
                <Select
                  id="category"
                  isMulti
                  name="categories"
                  options={categoryOptions}
                  className={s.selectInput}
                  classNamePrefix="select"
                  onChange={(val: MultiValue<any>) => {
                    setFieldValue('categories', val);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select category"
                />
              </div> */}
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
