import { useState, useEffect } from 'react';

import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectList } from '@containers/Trade/ProjectLists';
import Row from 'react-bootstrap/Row';
import s from './RecentWorks.module.scss';
import {
  getMarketplaceBtcList,
  IGetMarketplaceBtcListItem,
} from '@services/marketplace-btc';
import { Loading } from '@components/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';

const LIMIT = 20;

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listData, setListData] = useState<IGetMarketplaceBtcListItem[]>([]);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const tmpList = await getMarketplaceBtcList({
        limit: LIMIT,
        offset: listData.length || 0,
        'buyable-only': false,
      });

      if (!tmpList || !tmpList.length) return setIsLoaded(true);
      const newList = uniqBy(
        [...listData, ...tmpList],
        item => item.inscriptionID
      );

      setListData(newList || []);
      setIsLoaded(true);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchData = debounce(fetchData, 300);

  useEffect(() => {
    debounceFetchData();
  }, []);

  return (
    <div className={s.recentWorks}>
      <Row className={s.recentWorks_projects}>
        {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {isLoaded && (
          <InfiniteScroll
            dataLength={listData.length}
            next={debounceFetchData}
            className={s.recentWorks_projects_list}
            hasMore={true}
            loader={
              isLoading ? (
                <div className={s.recentWorks_projects_loader}>
                  <Loading isLoaded={isLoading} />
                </div>
              ) : null
            }
            endMessage={<></>}
          >
            <ProjectList listData={listData} />
          </InfiniteScroll>
        )}
      </Row>
    </div>
  );
};
