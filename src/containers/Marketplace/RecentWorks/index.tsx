import { useCallback, useState } from 'react';

import Heading from '@components/Heading';
import ProjectListLoading from '@components/ProjectListLoading';
import { ProjectList } from '@components/ProjectLists';
import { TriggerLoad } from '@components/TriggerLoader';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { IGetProjectListResponse } from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { getProjectList } from '@services/project';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useAsyncEffect from 'use-async-effect';
import s from './RecentWorks.module.scss';

// const SORT_OPTIONS: Array<{ value: string; label: string }> = [
//   {
//     value: '',
//     label: 'All',
//   },
//   {
//     value: 'progress',
//     label: 'Minting in progress',
//   },
//   {
//     value: 'fully',
//     label: 'Fully minted',
//   },
// ];

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoadedMore, setIsLoadMore] = useState<boolean>(false);
  const [projects, setProjects] = useState<IGetProjectListResponse>();
  const [listData, setListData] = useState<Project[]>([]);
  const [sort, _] = useState<string | null>('');
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  // const selectedOption = useMemo(() => {
  //   return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  // }, [sort]);

  const getProjectAll = useCallback(async () => {
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
  }, [projects]);

  const onLoadMore = async () => {
    switch (sort) {
      default:
        getProjectAll();
        break;
    }
  };

  // const sortChange = async (): Promise<void> => {
  //   switch (sort) {
  //     case 'progress':
  //       setListData(projects.result);
  //       break;
  //     default:
  //       getProjectAll();
  //       break;
  //   }
  //
  //   // const tmpProject = await getProjectList({
  //   //   contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
  //   //   limit: 100,
  //   //   page: 1,
  //   // });
  //   // setIsLoaded(true);
  //   // setProjects(tmpProject.result);
  // };

  useAsyncEffect(async () => {
    // sortChange();
    setIsLoadMore(false);
    await getProjectAll();
    setIsLoaded(true);
  }, []);

  return (
    <div className={s.recentWorks}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col xs={'auto'}>
          <Heading as="h4" fontWeight="semibold">
            Generative art on Bitcoin. Be the first to collect.
          </Heading>
        </Col>
        <Col xs={'auto'} />
      </Row>
      <Row className={s.recentWorks_projects}>
        {/* <Loading isLoaded={isLoaded} /> */}
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
    </div>
  );
};
