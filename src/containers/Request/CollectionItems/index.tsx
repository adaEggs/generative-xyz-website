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
            <div className={cn(s.collections_header)}>
              <div className="col-md-1">No.</div>
              <div className="col-md-1">Thumbnail</div>
              <div className="col-md-2 d-flex justify-content-center">
                Collections Name
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                #Outputs
              </div>
              <div className="col-md-2 d-flex justify-content-center">
                Artists
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                Expiration
              </div>
              <div className="col-md-2 d-flex justify-content-center">
                Status
              </div>
              <div className="col-md-2 invisible">Action</div>
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
                    <div className="col-md-1">{item?.seq_id}</div>
                    <div className="col-md-1">
                      <Image
                        src={convertIpfsToHttp(item?.project?.thumbnail)}
                        width={60}
                        height={60}
                        alt={item?.project?.name}
                      />
                    </div>
                    <div className="col-md-2 d-flex justify-content-center">
                      {item?.project?.name}
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">
                      {item?.project?.max_supply}
                    </div>
                    <div className="col-md-2 d-flex justify-content-center">
                      {item?.user?.display_name}
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">{`${dayjs(
                      item?.expired_at
                    ).format('MMM DD')}`}</div>
                    <div className="col-md-2 d-flex justify-content-center">
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
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
