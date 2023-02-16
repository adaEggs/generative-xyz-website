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
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { ROUTE_PATH } from '@constants/route-path';
import ButtonIcon from '@components/ButtonIcon';
import { useRouter } from 'next/router';
import CategoryTab from '@components/CategoryTab';
import cs from 'classnames';
import { getCategoryList } from '@services/category';
import { Category } from '@interfaces/category';

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

const LOG_PREFIX = 'RecentWorks';

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoadedMore, setIsLoadMore] = useState<boolean>(false);
  const [projects, setProjects] = useState<IGetProjectListResponse>();
  const [listData, setListData] = useState<Project[]>([]);
  const [sort, _] = useState<string | null>('');
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState<Category[]>();
  // console.log('🚀 ~ RecentWorks ~ categoriesList', categoriesList);

  // const selectedOption = useMemo(() => {
  //   return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  // }, [sort]);

  const getProjectAll = useCallback(async () => {
    try {
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
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    }
  }, [projects]);

  const onLoadMore = async () => {
    switch (sort) {
      default:
        getProjectAll();
        break;
    }
  };

  const fetchAllCategory = async () => {
    try {
      const { result } = await getCategoryList();
      if (result && result.length > 0) {
        setCategoriesList(result);
      }
    } catch (err: unknown) {
      log('failed to fetch category list', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
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
    await fetchAllCategory();
    setIsLoaded(true);
  }, []);

  return (
    <div className={s.recentWorks}>
      <Heading as="h4" fontWeight="medium" className={s.recentWorks_title}>
        NFTs on Bitcoin. Be the first to collect.
      </Heading>
      <Row className={s.recentWorks_heading}>
        <Col
          className={cs(s.recentWorks_heading_col, s.category_list)}
          md={'auto'}
          xs={'12'}
        >
          <CategoryTab type="3" text="All" />
          {categoriesList &&
            categoriesList?.length > 0 &&
            categoriesList.map(category => (
              <CategoryTab
                type="3"
                text={category.name}
                key={`category-${category.id}`}
              />
            ))}

          <CategoryTab
            type="3"
            text="Very long category that I want to test it out"
          />
        </Col>
        <Col className={s.recentWorks_heading_col} md={'auto'} xs={'12'}>
          <ButtonIcon
            onClick={() => router.push(ROUTE_PATH.CREATE_BTC_PROJECT)}
            variants={'primary'}
            sizes={'medium'}
          >
            Launch your art
          </ButtonIcon>
        </Col>
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
