import React, { useContext, useEffect, useLayoutEffect } from 'react';
import s from './404.module.scss';
import { LoadingProvider } from '@contexts/loading-context';
import { getProjectList } from '@services/project';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';

const PageDeep = (): JSX.Element => {
  useLayoutEffect(async (): Promise<void> => {
    const tmpProject = await getProjectList({
      contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
      limit: 1000000,
      page: 1,
    });

    console.log(tmpProject);
  });

  return <div className={s.pageDeep}></div>;
};

const Wrapper404 = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <PageDeep />
    </LoadingProvider>
  );
};

export default PageDeep;
