import { useState, useEffect } from 'react';

import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import Row from 'react-bootstrap/Row';
import s from './Collection.module.scss';
import {
  getCollectionBtcList,
  IGetCollectionBtcListItem,
} from '@services/marketplace-btc';
import { Loading } from '@components/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { List } from '@containers/Trade/Collection/List';

const LIMIT = 20;

const Collections = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listData, setListData] = useState<IGetCollectionBtcListItem[]>([]);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const tmpList = await getCollectionBtcList({
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
    <div className={s.collection}>
      <Row className={s.collection_projects}>
        {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {isLoaded && (
          <InfiniteScroll
            dataLength={listData.length}
            next={debounceFetchData}
            className={s.collection_projects_list}
            hasMore={true}
            loader={
              isLoading ? (
                <div className={s.collection_projects_loader}>
                  <Loading isLoaded={isLoading} />
                </div>
              ) : null
            }
            endMessage={<></>}
          >
            <List listData={listData} />
          </InfiniteScroll>
        )}
      </Row>
    </div>
  );
};

export default Collections;
