/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { v4 } from 'uuid';

import { ROUTE_PATH } from '@constants/route-path';
import { Loading } from '@components/Loading';
import { getDaoProjects, voteDaoProject } from '@services/request';
import Button from '@components/Button';
import { convertIpfsToHttp } from '@utils/image';
import { LIMIT_PER_PAGE as LIMIT } from '@constants/dao';
import { formatBTCPrice } from '@utils/format';

import s from './CollectionItems.module.scss';
import NoData from '../NoData';
import SkeletonItem from '../SkeletonItem';

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

  const initData = async (): Promise<void> => {
    setIsLoaded(false);
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
  };

  useEffect(() => {
    initData();
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
      return (
        <span className={cn(s.collections_status, s.collections_voting)}>
          Voting
        </span>
      );
    }
    if (status === 1) {
      return (
        <span className={cn(s.collections_status, s.collections_executed)}>
          Executed
        </span>
      );
    }
    if (status === 2) {
      return (
        <span className={cn(s.collections_status, s.collections_defeated)}>
          Defeated
        </span>
      );
    }
    return <span className={s.collections_status}>Unknow</span>;
  };

  const submitVote = async (projectId: string, voteType: number) => {
    toast.remove();
    const result = await voteDaoProject(projectId, voteType);
    if (result?.status) {
      toast.success('Voted successfully');
      initData();
    } else {
      toast.error('Voted failed');
    }
  };

  const goToCollectionPage = (tokenId: string): void => {
    router.push(`${ROUTE_PATH.GENERATIVE}/${tokenId}`);
  };

  const goToProfilePage = (walletAddress: string): void => {
    router.push(`${ROUTE_PATH.PROFILE}/${walletAddress}`);
  };

  return (
    <div className={cn(className, s.collections)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col xs={12}>
            {[...Array(LIMIT)].map(() => (
              <SkeletonItem key={`token-loading-${v4()}`} />
            ))}
          </Col>
        ) : (
          <>
            <div className={cn(s.collections_header)}>
              <div className="col-md-1">Proposal ID</div>
              <div className="col-md-2">Image</div>
              <div className="col-md-2 d-flex justify-content-center">
                Collections
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                Max Supply
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                Price
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                Artist
              </div>
              <div className="col-md-1 d-flex justify-content-center">
                Expiration
              </div>
              <div className="col-md-1 d-flex justify-content-center">
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
                    <div className="col-md-2">
                      <Image
                        className={s.collections_pointer}
                        onClick={() =>
                          goToCollectionPage(item?.project?.token_id)
                        }
                        src={convertIpfsToHttp(item?.project?.thumbnail)}
                        width={120}
                        height={120}
                        alt={item?.project?.name}
                      />
                    </div>
                    <div className="col-md-2 d-flex justify-content-center">
                      <span
                        className={s.collections_pointer}
                        onClick={() =>
                          goToCollectionPage(item?.project?.token_id)
                        }
                      >
                        {item?.project?.name}
                      </span>
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">
                      {item?.project?.max_supply}
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">
                      {formatBTCPrice(item?.project?.mint_price)} BTC
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">
                      <span
                        className={s.collections_pointer}
                        onClick={() =>
                          goToProfilePage(item?.user?.wallet_address)
                        }
                      >
                        {item?.user?.display_name}
                      </span>
                    </div>
                    <div className="col-md-1 d-flex justify-content-center">{`${dayjs(
                      item?.expired_at
                    ).format('MMM DD')}`}</div>
                    <div className="col-md-1 d-flex justify-content-center">
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                      <Button
                        className={cn(s.collections_btn, s.collections_mr6)}
                        disabled={item?.action?.can_vote === false}
                        variant="outline-black"
                        onClick={() => submitVote(item?.id, 0)}
                      >
                        Against
                      </Button>
                      <Button
                        className={cn(s.collections_btn, s.collections_btnVote)}
                        disabled={item?.action?.can_vote === false}
                        onClick={() => submitVote(item?.id, 1)}
                      >
                        Vote
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

export default React.memo(CollectionItems);
