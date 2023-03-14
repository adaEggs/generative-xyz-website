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
import { getDaoArtists } from '@services/request';
import Button from '@components/Button';
import useDidMountEffect from '@hooks/useDidMountEffect';
import { formatAddress } from '@utils/format';

import s from './UserItems.module.scss';

import { LIMIT } from '../useApi';
import NoData from '../NoData';

interface UserItemsProps {
  className?: string;
}

export const UserItems = ({ className }: UserItemsProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '', status = '', sort = '' } = router.query;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [totalPerPage, setTotalPerPage] = useState<number>(1);
  const [currentCursor, setCurrentCursor] = useState<string>('');

  useDidMountEffect(() => {
    (async () => {
      const users = await getDaoArtists({
        keyword,
        status,
        sort,
        limit: LIMIT,
      });
      setCombineList([...(users?.result || [])]);
      setTotalPerPage(users?.total || LIMIT);
      setIsLoaded(true);
      setCurrentCursor(users?.cursor || '');
    })();
  }, [keyword, status, sort]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      if (totalPerPage > LIMIT) {
        const nextUsers = await getDaoArtists({
          keyword,
          status,
          sort,
          limit: LIMIT,
          cursor: currentCursor,
        });
        setTotalPerPage(nextUsers?.total || LIMIT);
        setCurrentCursor(nextUsers?.cursor || '');
        const newList = combineList.concat([...(nextUsers?.result || [])]);
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
    <div className={cn(className, s.users)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            <ProjectListLoading numOfItems={12} />
          </Col>
        ) : (
          <>
            <div className={s.users_header}>
              <div className="col-md-1">No.</div>
              <div className="col-md-2">Artists</div>
              <div className="col-md-2">Twitter</div>
              <div className="col-md-2">Registration date</div>
              <div className="col-md-2">Status</div>
              <div className="invisible col-md-3" />
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
                    <div className={s.users_loader}>
                      <Loading isLoaded={!isLoading} />
                    </div>
                  ) : null
                }
                endMessage={<></>}
              >
                {combineList?.map((item: any) => (
                  <div key={item.id} className={s.users_row}>
                    <div className="col-md-1">{item?.seq_id}</div>
                    <div className="col-md-2">
                      {item?.user?.display_name ||
                        formatAddress(item?.user?.wallet_address)}
                    </div>
                    <div className="col-md-2">
                      {item?.user?.profile_social?.twitter}
                    </div>
                    <div className="col-md-2">{`${dayjs(
                      item?.user?.updated_at
                    ).format('MMM DD')}`}</div>
                    <div className="col-md-2">
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-3 d-flex justify-content-end">
                      <Button variant="outline-black">Report</Button>
                      <Button disabled={item?.action?.can_vote === false}>Verify</Button>
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

export default React.memo(UserItems);
