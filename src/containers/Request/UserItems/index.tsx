/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { v4 } from 'uuid';

import { ROUTE_PATH } from '@constants/route-path';
import { Loading } from '@components/Loading';
import { getDaoArtists, voteDaoArtist } from '@services/request';
import Button from '@components/Button';
// import useDidMountEffect from '@hooks/useDidMountEffect';
import { formatAddress } from '@utils/format';
import { LIMIT_PER_PAGE as LIMIT } from '@constants/dao';

import s from './UserItems.module.scss';
import NoData from '../NoData';
import SkeletonItem from '../SkeletonItem';

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

  const initData = async (): Promise<void> => {
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
  };

  useEffect(() => {
    initData();
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
      return (
        <span className={cn(s.users_status, s.users_verifying)}>Verifying</span>
      );
    }
    if (status === 1) {
      return (
        <span className={cn(s.users_status, s.users_verified)}>Verified</span>
      );
    }
    return <span className={s.users_status}>Unknow</span>;
  };

  const submitVote = async (projectId: string, voteType: number) => {
    toast.remove();
    const result = await voteDaoArtist(projectId, voteType);
    if (result?.status) {
      toast.success('Voted successfully');
      initData();
    } else {
      toast.error('Voted failed');
    }
  };

  const goToProfilePage = (
    walletAddressBtcTaproot: string,
    walletAddress: string
  ): void => {
    router.push(
      `${ROUTE_PATH.PROFILE}/${walletAddressBtcTaproot || walletAddress}`
    );
  };

  return (
    <div className={cn(className, s.users)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col md={12}>
            {[...Array(LIMIT)].map(() => (
              <SkeletonItem key={`token-loading-${v4()}`} />
            ))}
          </Col>
        ) : (
          <>
            <div className={s.users_header}>
              <div className="col-md-1">No.</div>
              <div className="col-md-2">Artists</div>
              <div className="col-md-3">Twitter</div>
              <div className="col-md-2">Registration date</div>
              <div className="col-md-2">Status</div>
              <div className="invisible col-md-2" />
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
                      <span
                        onClick={() =>
                          goToProfilePage('', item?.user?.wallet_address)
                        }
                      >
                        {item?.user?.display_name ||
                          formatAddress(item?.user?.wallet_address)}
                      </span>
                    </div>
                    <div className="col-md-3">
                      {item?.user?.profile_social?.twitter || '-'}
                    </div>
                    <div className="col-md-2">{`${dayjs(
                      item?.user?.updated_at
                    ).format('MMM DD')}`}</div>
                    <div className="col-md-2">
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                      <Button
                        className={cn(s.users_btn, s.users_mr6)}
                        disabled={item?.action?.can_vote === false}
                        variant="outline-black"
                        onClick={() => submitVote(item?.id, 0)}
                      >
                        Report
                      </Button>
                      <Button
                        className={cn(s.users_btn, s.users_btnVote)}
                        disabled={item?.action?.can_vote === false}
                        onClick={() => submitVote(item?.id, 1)}
                      >
                        Verify
                      </Button>
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
