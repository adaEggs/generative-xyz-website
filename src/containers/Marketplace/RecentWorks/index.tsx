import { useCallback, useEffect, useMemo, useState } from 'react';

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
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '@interfaces/select-input';
import { isProduction } from '@utils/common';

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: 'priority-desc',
    label: 'Default',
  },
  {
    value: 'newest',
    label: 'Latest',
  },
];

const LOG_PREFIX = 'RecentWorks';

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoadedMore, setIsLoadMore] = useState<boolean>(false);
  const [projects, setProjects] = useState<IGetProjectListResponse>();
  const [listData, setListData] = useState<Project[]>([]);
  const [sort, setSort] = useState<string | null>('');
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState<Category[]>();
  const [filterCategory, setFilterCategory] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  // const [pageN, setPage] = useState(0);
  const [pageNum, setPageNum] = useState(0);

  const selectedOption = useMemo(() => {
    return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  }, [sort]);

  const getProjectAll = useCallback(
    async ({ page }: { page: number }) => {
      try {
        setIsLoadMore(false);
        const tmpProject = await getProjectList({
          contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
          limit: 12,
          page: page + 1,
          category: filterCategory ? [filterCategory] : [''],
          sort: sort || SORT_OPTIONS[0].value,
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
    },
    [projects, filterCategory, sort]
  );

  const onLoadMore = () => {
    getProjectAll({ page: pageNum + 1 });
    setPageNum(prev => prev + 1);

    // setPage(page + 1);
    // switch (sort) {
    //   default:
    //     getProjectAll();
    //     break;
    // }
  };

  const fetchAllCategory = async () => {
    try {
      setCategoriesLoading(true);
      const { result } = await getCategoryList();
      if (result && result.length > 0) {
        setCategoriesList(result);
        setCategoriesLoading(false);
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

  const handleClickCategory = (categoryID: string) => {
    setFilterCategory(categoryID);
    setProjects(undefined);
  };

  // useAsyncEffect(async () => {
  //   // sortChange();
  //   setIsLoadMore(false);
  //   await getProjectAll();
  //   setIsLoaded(true);
  // }, [page]);

  useAsyncEffect(async () => {
    // sortChange();
    // setPage(0);
    setIsLoadMore(false);
    setIsLoaded(false);
    await getProjectAll({ page: 0 });
    setIsLoaded(true);
  }, [filterCategory]);

  useEffect(() => {
    fetchAllCategory();
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
          <CategoryTab
            type="3"
            text="All"
            onClick={() => handleClickCategory('')}
            active={filterCategory === ''}
            loading={categoriesLoading}
          />
          {categoriesList &&
            categoriesList?.map(category => (
              <CategoryTab
                type="3"
                text={category.name}
                key={`category-${category.id}`}
                onClick={() => handleClickCategory(category.id)}
                active={filterCategory === category.id}
                loading={categoriesLoading}
              />
            ))}
        </Col>
        <Col
          className={cs(s.recentWorks_heading_col, s.sort_dropdown)}
          md={'auto'}
          xs={'12'}
        >
          {!isProduction() && (
            <div className={s.dropDownWrapper}>
              <Select
                isSearchable={false}
                isClearable={false}
                defaultValue={selectedOption}
                options={SORT_OPTIONS}
                className={'select-input'}
                classNamePrefix="select"
                onChange={(op: SingleValue<SelectOption>) => {
                  if (op) {
                    setSort(op.value);
                    setProjects(undefined);
                  }
                }}
              />
            </div>
          )}
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
