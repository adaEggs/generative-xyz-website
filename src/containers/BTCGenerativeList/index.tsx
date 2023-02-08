import ProjectListLoading from '@components/ProjectListLoading';
import { ProjectList } from '@components/ProjectLists';
import { TriggerLoad } from '@components/TriggerLoader';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { IGetProjectListResponse } from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { getProjectList } from '@services/project';
import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import useAsyncEffect from 'use-async-effect';
import s from './styles.module.scss';

const BTCGenerativeList: React.FC = (): React.ReactElement => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoadedMore, setIsLoadMore] = useState<boolean>(false);
  const [projects, setProjects] = useState<IGetProjectListResponse>();
  const [listData, setListData] = useState<Project[]>([]);
  const [sort, _] = useState<string | null>('');
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  const getProjectAll = async () => {
    let page = (projects && projects?.page) || 0;
    page += 1;

    setIsLoadMore(false);
    const tmpProject = await getProjectList({
      contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
      limit: 12,
      page,
    });

    if (tmpProject) {
      if (projects && projects?.result) {
        tmpProject.result = [...projects.result, ...tmpProject.result];
      }

      setIsLoadMore(true);
      setProjects(tmpProject);
      setListData(tmpProject?.result || []);
      setCurrentTotal(tmpProject.total || 0);
    }
  };

  const onLoadMore = async () => {
    switch (sort) {
      default:
        getProjectAll();
        break;
    }
  };

  useAsyncEffect(async () => {
    setIsLoadMore(false);
    await getProjectAll();
    setIsLoaded(true);
  }, []);

  return (
    <section className={s.btcGenerativeList}>
      <Container>
        <Row className={s.recentWorks_projects}>
          {!isLoaded && <ProjectListLoading numOfItems={12} />}
          {isLoaded && (
            <div className={s.recentWorks_projects_list}>
              <ProjectList listData={listData} />
              <TriggerLoad
                len={listData.length || 0}
                total={currentTotal || 0}
                isLoaded={isLoadedMore}
                onEnter={onLoadMore}
              />
            </div>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default BTCGenerativeList;
