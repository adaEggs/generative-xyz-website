import { useCallback, useState } from 'react';

import Heading from '@components/Heading';
import ProjectListLoading from '../ProjectListLoading';
import { ProjectList } from '../ProjectLists';

import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { IGetProjectListResponse } from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { getProjectList } from '@services/project';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useAsyncEffect from 'use-async-effect';
import s from './RecentWorks.module.scss';
import { Button } from 'react-bootstrap';

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [projects, setProjects] = useState<IGetProjectListResponse>();
  const [listData, setListData] = useState<Project[]>([]);

  // const selectedOption = useMemo(() => {
  //   return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  // }, [sort]);

  const getProjectAll = useCallback(async () => {
    let page = (projects && projects?.page) || 0;
    page += 1;

    const tmpProject = await getProjectList({
      contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
      limit: 12,
      page,
    });

    if (tmpProject) {
      if (projects && projects?.result) {
        tmpProject.result = [...projects.result, ...tmpProject.result];
      }

      setProjects(tmpProject);
      setListData(tmpProject?.result || []);
    }
  }, [projects]);

  useAsyncEffect(async () => {
    await getProjectAll();
    setIsLoaded(true);
  }, []);

  return (
    <div className={s.recentWorks}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col xs={'auto'}>
          <Heading as="h4" fontWeight="semibold">
            Bazaar
          </Heading>
        </Col>
        <Col xs={'auto'}>
          <Button className={s.recentWorks_btn} size="lg">
            List for sale
          </Button>
        </Col>
      </Row>
      <Row className={s.recentWorks_projects}>
        {/* <Loading isLoaded={isLoaded} /> */}
        {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {isLoaded && (
          <div className={s.recentWorks_projects_list}>
            <ProjectList listData={listData} />
          </div>
        )}
      </Row>
    </div>
  );
};
