/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';

import { getSearchByKeyword } from '@services/search';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectCard } from '@components/ProjectCard';
import { Loading } from '@components/Loading';

import s from './CollectionItems.module.scss';
import { PAYLOAD_DEFAULT, OBJECT_TYPE } from '../constant';
import useSearchApi from '../useApi';
import NoData from '../NoData';

interface CollectionItemsProps {
  className?: string;
}

export const CollectionItems = ({
  className,
}: CollectionItemsProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;

  const filterBase = {
    ...PAYLOAD_DEFAULT,
    keyword,
    type: OBJECT_TYPE.PROJECT,
  };

  const { resultByCollection } = useSearchApi({ keyword });

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCombineList([...(resultByCollection?.result || [])]);
    setIsLoaded(true);
    setCurrentPage(1);
  }, [keyword]);

  useEffect(() => {
    setCombineList([...(resultByCollection?.result || [])]);
  }, [resultByCollection?.result]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      if (nextPage <= (resultByCollection?.totalPage || 1)) {
        filterBase.page = nextPage;
        const nextResultByCollections = await getSearchByKeyword(filterBase);
        setCurrentPage(nextPage);
        const newList = combineList.concat([
          ...(nextResultByCollections?.result || []),
        ]);
        setCombineList(newList);
      }
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchCombineList = debounce(fetchCombineList, 300);

  return (
    <div className={cn(className, s.items)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            <ProjectListLoading numOfItems={12} />
          </Col>
        ) : (
          <>
            {typeof resultByCollection !== 'undefined' &&
            combineList.length === 0 ? (
              <NoData />
            ) : (
              <InfiniteScroll
                dataLength={combineList.length}
                next={debounceFetchCombineList}
                className={cn('row', s.items_list)}
                hasMore
                loader={
                  isLoading ? (
                    <div className={s.items_loader}>
                      <Loading isLoaded={!isLoading} />
                    </div>
                  ) : null
                }
                endMessage={<></>}
              >
                {combineList?.map((item: any) => (
                  <ProjectCard
                    key={item?.project?.tokenID}
                    className="col-xs-6 col-md-3"
                    project={item?.project}
                  />
                ))}
              </InfiniteScroll>
            )}
          </>
        )}
      </Row>
    </div>
  );
};

export default React.memo(CollectionItems);
