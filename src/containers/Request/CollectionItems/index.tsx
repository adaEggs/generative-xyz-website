/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import cn from 'classnames';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';

import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { Loading } from '@components/Loading';
import { getDaoProjects } from '@services/request';
import Button from '@components/Button';
import { convertIpfsToHttp } from '@utils/image';
import useDidMountEffect from '@hooks/useDidMountEffect';

import s from './CollectionItems.module.scss';

import { LIMIT } from '../useApi';
import NoData from '../NoData';

interface CollectionItemsProps {
  className?: string;
}

export const CollectionItems = ({
  className,
}: CollectionItemsProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '', status = '', sort = '' } = router.query;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [totalPerPage, setTotalPerPage] = useState<number>(1);
  const [currentCursor, setCurrentCursor] = useState<string>('');

  useDidMountEffect(() => {
    (async () => {
      const collections = await getDaoProjects({
        keyword,
        status,
        sort,
        limit: LIMIT,
      });
      setCombineList([...(collections?.result || [])]);
      setTotalPerPage(collections?.total || LIMIT);
      setIsLoaded(true);
      setCurrentCursor(collections?.cursor || '');
    })();
  }, [keyword, status, sort]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      if (totalPerPage > LIMIT) {
        const nextCollections = await getDaoProjects({
          keyword,
          status,
          sort,
          limit: LIMIT,
          cursor: currentCursor,
        });
        setTotalPerPage(nextCollections?.total || LIMIT);
        setCurrentCursor(nextCollections?.cursor || '');
        const newList = combineList.concat([
          ...(nextCollections?.result || []),
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

  const getStatusProposal = (status: number) => {
    if (status === 0) {
      return <span>Voting</span>;
    }
    if (status === 1) {
      return <span>Executed</span>;
    }
    if (status === 2) {
      return <span>Defeated</span>;
    }
    return <span>Unknow</span>;
  };

  return (
    <div className={cn(className, s.collections)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            <ProjectListLoading numOfItems={12} />
          </Col>
        ) : (
          <>
            <div className={s.collections_header}>
              <div>No.</div>
              <div>Thumbnail</div>
              <div>Collections Name</div>
              <div>#Outputs</div>
              <div>Artists</div>
              <div>Expiration</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {typeof isLoaded && combineList.length === 0 ? (
              <NoData />
            ) : (
              <InfiniteScroll
                dataLength={combineList.length}
                next={debounceFetchCombineList}
                hasMore
                loader={
                  isLoading ? (
                    <div className={s.collections_loader}>
                      <Loading isLoaded={!isLoading} />
                    </div>
                  ) : null
                }
                endMessage={<></>}
              >
                {combineList?.map((item: any) => (
                  <div key={item.id} className={s.collections_row}>
                    <div>{item?.seq_id}</div>
                    <div>
                      <Image
                        src={convertIpfsToHttp(item?.project?.thumbnail)}
                        width={60}
                        height={60}
                        alt={item?.project?.name}
                      />
                    </div>
                    <div>{item?.project?.name}</div>
                    <div>{item?.project?.max_supply}</div>
                    <div>{item?.user?.display_name}</div>
                    <div>{`${dayjs(item?.expired_at).format('MMM DD')}`}</div>
                    <div>{getStatusProposal(item?.status)}</div>
                    <div>
                      <Button>Against</Button>
                      <Button>Vote</Button>
                    </div>
                  </div>
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
