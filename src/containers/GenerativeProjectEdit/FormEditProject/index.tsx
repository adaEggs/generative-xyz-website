import ButtonIcon from '@components/ButtonIcon';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { Formik } from 'formik';
import { toast } from 'react-hot-toast';

import { IUpdateProjectPayload } from '@interfaces/api/project';
import { MIN_MINT_BTC_PROJECT_PRICE } from '@constants/config';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { deleteProject, updateProject } from '@services/project';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import ImagePreviewInput from '@components/ImagePreviewInput';
import s from './styles.module.scss';
import { formatBTCPrice } from '@utils/format';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { uploadFile } from '@services/file';
import { SelectOption } from '@interfaces/select-input';
import useAsyncEffect from 'use-async-effect';
import { getCategoryList } from '@services/category';
import Select, { MultiValue } from 'react-select';
import MarkdownEditor from '@components/MarkdownEditor';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';

const LOG_PREFIX = 'FormEditProfile';

type IUpdateProjectFormValue = {
  name: string;
  description: string;
  thumbnail: string;
  royalty: number;
  mintPrice: string;
  maxSupply: number;
  isHidden: boolean;
  categories: Array<SelectOption>;
};

const FormEditProject = () => {
  const router = useRouter();
  const { setProjectData, projectData: project } = useContext(
    GenerativeProjectDetailContext
  );
  const [newFile, setNewFile] = useState<File | null>();
  const [uploadError, setUploadError] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<Array<SelectOption>>(
    []
  );
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const nftMinted = useMemo((): number => {
    return project?.mintingInfo?.index || 0;
  }, [project]);

  const projectFiles = useMemo((): number => {
    return project?.totalImages || 0;
  }, [project]);

  const projectTokenId = useMemo((): string => {
    return project?.tokenID || '';
  }, [project]);

  const newThumbnail = useMemo((): File | null => {
    return newFile || null;
  }, [newFile]);

  const thumbnailReview = useMemo((): string | null => {
    if (newFile) {
      return URL.createObjectURL(newFile);
    }
    return null;
  }, [newFile]);

  const validateForm = (
    values: IUpdateProjectFormValue
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = 'Name is required';
    }

    if (!values.description) {
      errors.description = 'Description is required';
    }

    if (!values.maxSupply.toString()) {
      errors.maxSupply = 'Number of editions is required.';
    } else if (parseInt(values.maxSupply.toString(), 10) <= 0) {
      errors.maxSupply = 'Invalid number. Must be greater than 0.';
    } else if (
      projectFiles !== 0 &&
      parseInt(values.maxSupply.toString(), 10) > projectFiles &&
      parseInt(values.maxSupply.toString(), 10) >= nftMinted
    ) {
      errors.maxSupply = `Invalid number. Must be between ${
        nftMinted || 1
      } and ${projectFiles}.`;
    }

    if (!values.mintPrice.toString()) {
      errors.mintPrice = 'Price is required.';
    } else if (
      parseFloat(values.mintPrice.toString()) < MIN_MINT_BTC_PROJECT_PRICE
    ) {
      errors.mintPrice = `Invalid number. Must be equal or greater than ${MIN_MINT_BTC_PROJECT_PRICE}.`;
    }

    if (!values.royalty.toString()) {
      errors.royalty = 'Royalty is required.';
    } else if (parseInt(values.royalty.toString(), 10) < 0) {
      errors.royalty = 'Invalid number. Must be equal or greater than 0.';
    } else if (parseInt(values.royalty.toString(), 10) > 25) {
      errors.royalty = 'Invalid number. Must be  less then 25.';
    }

    return errors;
  };

  const handleSubmit = async (values: IUpdateProjectFormValue) => {
    let thumbnailUrl = '';
    if (newThumbnail) {
      const uploadRes = await uploadFile({ file: newThumbnail });
      thumbnailUrl = uploadRes.url;
    } else if (uploadError) {
      return;
    }

    const isHidden = !values.isHidden;
    const categories: string[] = [];

    for (let i = 0; i < values.categories.length; i++) {
      values.categories[i] && categories.push(values.categories[i].value);
    }

    const payload: IUpdateProjectPayload = {
      name: values.name || '',
      description: values.description || '',
      thumbnail: thumbnailUrl || '',
      royalty: (Number(values.royalty) || 0) * 100,
      mintPrice: (values.mintPrice || 0).toString(),
      maxSupply: Number(values.maxSupply) || 0,
      isHidden: isHidden,
      categories: categories || [],
    };

    const res = await updateProject(
      GENERATIVE_PROJECT_CONTRACT,
      projectTokenId,
      payload
    );
    if (res) {
      setProjectData(res);
      toast.success('Update successfully');
    }

    try {
      return;
    } catch (err: unknown) {
      log('Failed to update profile ', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const valuesCategories = useCallback(
    (inputVal: Array<SelectOption> | null): Array<SelectOption> => {
      const mixDataInput: string[] = inputVal ? [] : project?.categories || [];
      if (inputVal !== null) {
        for (let i = 0; i < inputVal.slice(0, 3)?.length; i++) {
          inputVal[i] && mixDataInput.push(inputVal[i].value);
        }
      }

      const categories: Array<SelectOption> = mixDataInput.map(cat => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return categoryOptions.find(op => cat === op.value)!;
      });

      return categories;
    },
    [categoryOptions, project]
  );

  const handleDeleteProject = async () => {
    const text = `Are you sure delete your project?`;
    if (confirm(text) == true) {
      setIsDelete(true);
      await deleteProject(GENERATIVE_PROJECT_CONTRACT, projectTokenId);
      setIsDelete(false);
      router.push(ROUTE_PATH.PROFILE);
    }
  };

  useAsyncEffect(async () => {
    const { result } = await getCategoryList();
    const options = result.map(item => ({
      value: item.id,
      label: item.name,
    }));
    setCategoryOptions(options);
  }, []);

  return (
    <Formik
      key="listingForm"
      initialValues={{
        name: project?.name || '',
        description: project?.itemDesc || '',
        thumbnail: thumbnailReview || project?.image || '',
        royalty: (project?.royalty || 0) / 100,
        mintPrice: formatBTCPrice(project?.mintPrice || '0'),
        maxSupply: project?.maxSupply || 0,
        isHidden: !(project?.isHidden || false),
        categories: valuesCategories(null),
      }}
      validate={validateForm}
      onSubmit={handleSubmit}
      validateOnChange
      enableReinitialize
    >
      {({
        handleSubmit,
        isSubmitting,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className={s.projectEdit}>
          <div className={s.projectEdit_form}>
            <div className={s.projectEdit_form_wrapper}>
              <div className={s.projectDetail}>
                <div className={s.formWrapper}>
                  <div className={s.formItem}>
                    <label className={s.label_checkbox} htmlFor="isHidden">
                      <span>
                        <input
                          id="isHidden"
                          type="checkbox"
                          name="isHidden"
                          checked={values.isHidden}
                          className={s.input}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value="yes"
                        />
                      </span>
                      <span>Enabled</span>
                    </label>
                  </div>
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
                      onChange={(ops: MultiValue<SelectOption>) => {
                        setFieldValue('categories', ops);
                      }}
                      isOptionDisabled={() => values.categories.length >= 3}
                      onBlur={handleBlur}
                      value={valuesCategories(values.categories)}
                      placeholder="Select categories"
                    />
                  </div>

                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="description">
                      Description of your collection{' '}
                      <sup className={s.requiredTag}>*</sup>
                    </label>

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
                </div>
                <div className={s.uploadPreviewWrapper}>
                  <ImagePreviewInput
                    className={s.uploadPreviewWrapper_upload}
                    file={values.thumbnail}
                    onFileChange={setNewFile}
                    maxSizeKb={500}
                    onError={setUploadError}
                    previewHtml={<img src={values.thumbnail} alt="thumbnail" />}
                  />
                  <div className={s.uploadPreviewWrapper_thumb}>
                    <p>
                      <span>
                        Select thumbnail <sup className={s.requiredTag}>*</sup>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={s.setPrice}>
                <div className={s.formWrapper}>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="maxSupply">
                      Max supply <sup className={s.requiredTag}>*</sup>
                    </label>
                    <div className={s.inputContainer}>
                      <input
                        id="maxSupply"
                        type="number"
                        name="maxSupply"
                        className={s.input}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.maxSupply}
                        placeholder="Provide a number"
                      />
                      <div className={s.inputPostfix}>Items</div>
                    </div>
                    {errors.maxSupply && touched.maxSupply && (
                      <p className={s.error}>{errors.maxSupply}</p>
                    )}
                  </div>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="mintPrice">
                      PRICE <sup className={s.requiredTag}>*</sup>
                    </label>
                    <div className={s.inputContainer}>
                      <input
                        id="mintPrice"
                        type="number"
                        name="mintPrice"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={s.input}
                        value={values.mintPrice}
                        placeholder="Provide a number"
                      />
                      <div className={s.inputPostfix}>BTC</div>
                    </div>
                  </div>
                  <div className={s.formItem}>
                    <label className={s.label} htmlFor="royalty">
                      Royalties <sup className={s.requiredTag}>*</sup>
                    </label>
                    <div className={s.inputContainer}>
                      <input
                        id="royalty"
                        type="number"
                        name="royalty"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={s.input}
                        value={values.royalty}
                        placeholder="Provide a number"
                      />
                      <div className={s.inputPostfix}>%</div>
                    </div>
                    {errors.royalty && touched.royalty && (
                      <p className={s.error}>{errors.royalty}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={s.container}>
                <div className={s.actionWrapper}>
                  <ButtonIcon
                    onClick={() => handleSubmit}
                    disabled={isSubmitting || isDelete}
                    type="submit"
                    className={s.nextBtn}
                    sizes="medium"
                  >
                    Update
                  </ButtonIcon>
                  <ButtonIcon
                    onClick={handleDeleteProject}
                    disabled={isSubmitting || isDelete}
                    type="button"
                    className={s.nextBtn}
                    sizes="medium"
                    variants={'outline'}
                  >
                    Delete
                  </ButtonIcon>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormEditProject;
