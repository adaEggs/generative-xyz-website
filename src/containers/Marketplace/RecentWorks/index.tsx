import { useEffect, useMemo, useState } from 'react';

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
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select, { SingleValue } from 'react-select';
import s from './RecentWorks.module.scss';

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
  const router = useRouter();
  const { category } = router.query;

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

  // const getProjectAll = useCallback(
  //   async ({ page, categoryID }: { page: number; categoryID: string }) => {
  //     try {
  //       setIsLoadMore(false);

  //       const _categoryID = () => {
  //         if (categoryID === 'All') {
  //           return '';
  //         }
  //         return categoryID;
  //       };

  //       const tmpProject = await getProjectList({
  //         contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
  //         limit: 12,
  //         page: page + 1,
  //         category: categoryID ? [_categoryID()] : [''],
  //         sort: sort || SORT_OPTIONS[0].value,
  //       });

  //       if (tmpProject) {
  //         if (projects && projects?.result) {
  //           tmpProject.result = [...projects.result, ...tmpProject.result];
  //         }

  //         setIsLoadMore(true);
  //         setProjects(tmpProject);
  //         setListData(tmpProject?.result || []);
  //         setCurrentTotal(tmpProject.total || 0);

  //         return tmpProject;
  //       }
  //     } catch (err: unknown) {
  //       log(err as Error, LogLevel.ERROR, LOG_PREFIX);
  //     }
  //   },
  //   [projects, filterCategory, sort]
  // );

  const onLoadMore = () => {
    setPageNum(prev => prev + 1);
  };

  // const fetchAllCategory = async () => {
  //   try {
  //     setCategoriesLoading(true);
  //     const { result } = await getCategoryList();

  //     const historyCategoryID = sessionStorage.getItem(
  //       LocalStorageKey.CATEGORY_ID
  //     );

  //     if (result && result.length > 0) {
  //       setCategoriesList(result);
  //       setCategoriesLoading(false);
  //       const projectRes = await getProjectAll({
  //         page: 0,
  //         categoryID:
  //           historyCategoryID || historyCategoryID?.length === 0
  //             ? historyCategoryID
  //             : result[0].id,
  //       });
  //       setActiveCategory(
  //         historyCategoryID || historyCategoryID?.length === 0
  //           ? historyCategoryID
  //           : result[0].id
  //       );
  //       if (projectRes && projectRes.result && projectRes.result.length > 0)
  //         setIsLoaded(true);
  //     }
  //   } catch (err: unknown) {
  //     log('failed to fetch category list', LogLevel.ERROR, LOG_PREFIX);
  //     throw Error();
  //   }
  // };

  const handleClickCategory = (categoryID: string, categoryName: string) => {
    setFilterCategory(categoryID);
    setActiveCategory(categoryID);
    setProjects(undefined);
    router.push(`?category=${categoryName}`);
  };

  // useAsyncEffect(async () => {
  //   if (categoriesList && categoriesList.length > 0) {
  //     setIsLoadMore(false);
  //     setIsLoaded(false);
  //     await getProjectAll({
  //       page: 0,
  //       categoryID: filterCategory ? filterCategory : categoriesList[0].id,
  //     });
  //     setIsLoaded(true);
  //   }
  // }, [filterCategory, sort]);

  // useAsyncEffect(async () => {
  //   await fetchAllCategory();
  // }, []);

  //==========================================================================================

  const handleFetchProjects = async ({
    categoryID,
    page,
  }: {
    categoryID: string;
    page: number;
  }) => {
    try {
      setIsLoadMore(false);
      if (pageNum === 0) {
        setIsLoaded(false);
      }
      const _categoryID = () => {
        if (categoryID === 'All' || category === 'All') {
          return '';
        }
        return categoryID;
      };

      const tmpProject = await getProjectList({
        contractAddress: String(GENERATIVE_PROJECT_CONTRACT),
        limit: 12,
        page: page + 1,
        category: categoryID ? [_categoryID()] : [''],
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
      log('failed to get project lists', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    } finally {
      setIsLoaded(true);
    }
  };

  const handleFetchProjectsWithCategory = async () => {
    try {
      setIsLoaded(false);
      const { result: categories } = await getCategoryList();
      if (categories && categories.length > 0) {
        setCategoriesList(categories);
        setCategoriesLoading(false);

        const categoryID = categories.find(item => item.name === category)?.id;
        if (categoryID) {
          setFilterCategory(categoryID);
          setActiveCategory(categoryID);
          await handleFetchProjects({ categoryID, page: 0 });
        } else {
          setFilterCategory(categories[0].id);
          setActiveCategory(categories[0].id);
          await handleFetchProjects({ categoryID: categories[0].id, page: 0 });
        }
      }
    } catch (err: unknown) {
      log('failed to fetch projects', LogLevel.ERROR, LOG_PREFIX);
      throw Error();
    }
  };

  useEffect(() => {
    handleFetchProjectsWithCategory();
  }, [category]);

  useEffect(() => {
    if (categoriesList && filterCategory) {
      handleFetchProjects({ categoryID: filterCategory, page: pageNum });
    }
  }, [filterCategory, pageNum, sort]);

  useEffect(() => {
    if (categoriesList && categoriesList.length > 0 && category) {
      const categoryID = categoriesList.find(
        item => item.name === category
      )?.id;
      if (categoryID) {
        setFilterCategory(categoryID);
        setActiveCategory(categoryID);
      }
    }
  }, [category, categoriesList]);

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
                    handleClickCategory(category.id, category.name);
                  }}
                  active={activeCategory === category.id}
                />
              ))}
            <CategoryTab
              type="3"
              text="All"
              onClick={() => {
                setPageNum(0);
                handleClickCategory('All', 'All');
              }}
              active={activeCategory === 'All'}
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
                    setPageNum(0);
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
