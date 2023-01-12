import React, { useState, useCallback } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import s from './RecentWorks.module.scss';
import Heading from '@components/Heading';
import { Project } from '@interfaces/project';
import { getProjectList } from '@services/project';
import useAsyncEffect from 'use-async-effect';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
// import { SingleValue } from 'react-select';
import { ProjectList } from '@components/ProjectLists';
import { Loading } from '@components/Loading';
import { TriggerLoad } from '@components/TriggerLoader';
import { IGetProjectListResponse } from '@interfaces/api/project';
// import { CsSelect } from '@components/CsSelect';
// import { getProfileProjectsByWallet } from '@services/profile';

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
            Explore collections
          </Heading>
        </Col>
        <Col xs={'auto'}>
          {/*<CsSelect*/}
          {/*  isSearchable={false}*/}
          {/*  isClearable={false}*/}
          {/*  defaultValue={selectedOption}*/}
          {/*  options={SORT_OPTIONS}*/}
          {/*  classNamePrefix="select"*/}
          {/*  onChange={(val: SingleValue<any>) => {*/}
          {/*    sortChange(val.value);*/}
          {/*  }}*/}
          {/*/>*/}
        </Col>
      </Row>
      <Row className={s.recentWorks_projects}>
        <Loading isLoaded={isLoaded} />
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
