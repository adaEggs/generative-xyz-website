import { useCallback, useMemo, useState } from 'react';

import CategoryTab from '@components/CategoryTab';
import Heading from '@components/Heading';
import ProjectListLoading from '@components/ProjectListLoading';
import { ProjectList } from '@components/ProjectLists';
import { TriggerLoad } from '@components/TriggerLoader';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { LogLevel } from '@enums/log-level';
import { IGetProjectListResponse } from '@interfaces/api/project';
import { Category } from '@interfaces/category';
import { Project } from '@interfaces/project';
import { SelectOption } from '@interfaces/select-input';
import { getCategoryList } from '@services/category';
import { getProjectList } from '@services/project';
import log from '@utils/logger';
import cs from 'classnames';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select, { SingleValue } from 'react-select';
import useAsyncEffect from 'use-async-effect';
import s from './RecentWorks.module.scss';
import { LocalStorageKey } from '@enums/local-storage';

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: 'trending-score',
    label: 'Trending',
  },
  {
    value: 'newest',
    label: 'Latest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
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
  const [categoriesList, setCategoriesList] = useState<Category[]>();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selectedOption = useMemo(() => {
    return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  }, [sort]);

  const getProjectAll = useCallback(
    async ({ page, categoryID }: { page: number; categoryID: string }) => {
      try {
        setIsLoadMore(false);

        const tmpProject = await getProjectList({
          contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
          limit: 12,
          page: page + 1,
          category: categoryID ? [categoryID] : [''],
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

          return tmpProject;
        }
      } catch (err: unknown) {
        log(err as Error, LogLevel.ERROR, LOG_PREFIX);
      }
    },
    [projects, filterCategory, sort]
  );

  const onLoadMore = () => {
    getProjectAll({ page: pageNum + 1, categoryID: filterCategory || '' });
    setPageNum(prev => prev + 1);
  };

  const fetchAllCategory = async () => {
    try {
      setCategoriesLoading(true);
      const { result } = await getCategoryList();
      const historyCategoryID = sessionStorage.getItem(
        LocalStorageKey.CATEGORY_ID
      );
      if (result && result.length > 0) {
        setCategoriesList(result);
        setCategoriesLoading(false);
        const projectRes = await getProjectAll({
          page: 0,
          categoryID:
            historyCategoryID || historyCategoryID?.length === 0
              ? historyCategoryID
              : result[0].id,
        });
        setActiveCategory(
          historyCategoryID || historyCategoryID?.length === 0
            ? historyCategoryID
            : result[0].id
        );
        if (projectRes && projectRes.result && projectRes.result.length > 0)
          setIsLoaded(true);
      }
    } catch (err: unknown) {
      log('failed to fetch category list', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  const handleClickCategory = (categoryID: string) => {
    setFilterCategory(categoryID);
    setActiveCategory(categoryID);
    sessionStorage.setItem(LocalStorageKey.CATEGORY_ID, categoryID);
    setProjects(undefined);
  };

  useAsyncEffect(async () => {
    if (categoriesList && categoriesList.length > 0) {
      setIsLoadMore(false);
      setIsLoaded(false);
      await getProjectAll({ page: 0, categoryID: filterCategory || '' });
      setIsLoaded(true);
    }
  }, [filterCategory, sort]);

  useAsyncEffect(async () => {
    await fetchAllCategory();
  }, []);

  return (
    <div className={s.recentWorks}>
      <Container>
        <Heading as="h4" fontWeight="medium" className={s.recentWorks_title}>
          Be the first to collect art on Bitcoin.
        </Heading>
        <Row className={s.recentWorks_heading}>
          <Col
            className={cs(s.recentWorks_heading_col, s.category_list)}
            md={'auto'}
            xs={'12'}
          >
            {categoriesList &&
              categoriesList?.map(category => (
                <CategoryTab
                  type="3"
                  text={category.name}
                  key={`category-${category.id}`}
                  onClick={() => {
                    setPageNum(0);
                    handleClickCategory(category.id);
                  }}
                  active={activeCategory === category.id}
                  loading={categoriesLoading}
                />
              ))}
            <CategoryTab
              type="3"
              text="All"
              onClick={() => {
                setPageNum(0);
                handleClickCategory('');
              }}
              active={activeCategory === ''}
              loading={categoriesLoading}
            />
          </Col>
          <Col
            className={cs(s.recentWorks_heading_col, s.sort_dropdown)}
            md={'auto'}
            xs={'12'}
          >
            {/* {!isProduction() && ( */}
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
            {/* )} */}
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
      </Container>
    </div>
  );
};
