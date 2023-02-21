import React, { useState, useLayoutEffect } from 'react';
import s from './Deep.module.scss';
import { LoadingProvider } from '@contexts/loading-context';
import { getProjectList } from '@services/project';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { Project } from '@interfaces/project';

const PageDeep = (): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([]);
  useLayoutEffect(async (): Promise<void> => {
    const tmpProject = await getProjectList({
      contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
      limit: 1000000,
      page: 1,
    });
    setProjects(tmpProject);
  });

  return (
    <div className={s.pageDeep}>
      {projects.map((project: Project, key: number) => {
        return (
          <div>
            <img src={project.image} alt="image" />
          </div>
        );
      })}
    </div>
  );
};

const Wrapper404 = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <PageDeep />
    </LoadingProvider>
  );
};

export default PageDeep;
