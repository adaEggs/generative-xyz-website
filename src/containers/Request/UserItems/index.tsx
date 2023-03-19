/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import copy from 'copy-to-clipboard';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Empty } from '@components/Collection/Empty';
import Button from '@components/Button';
import { Loading } from '@components/Loading';
import { LIMIT_PER_PAGE as LIMIT } from '@constants/dao';
import { convertIpfsToHttp } from '@utils/image';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { getDaoArtists, voteDaoArtist } from '@services/request';
import { formatAddressDisplayName } from '@utils/format';
import { DEFAULT_USER_AVATAR } from '@constants/common';

import SkeletonItem from '../SkeletonItem';
import s from './UserItems.module.scss';

interface UserItemsProps {
  className?: string;
}

export const UserItems = ({ className }: UserItemsProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '', status = '', sort = '', id = '', tab } = router.query;
  let timeoutId = -1;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [combineList, setCombineList] = useState<any>([]);
  const [totalPerPage, setTotalPerPage] = useState<number>(1);
  const [currentCursor, setCurrentCursor] = useState<string>('');

  const initData = async (): Promise<void> => {
    setIsLoaded(false);
    const users = await getDaoArtists({
      id,
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
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      initData();
    }, 300); // don't need call many times
    return () => clearTimeout(timeoutId);
  }, [keyword, status, sort, id, tab, timeoutId]);

  const fetchCombineList = async () => {
    try {
      setIsLoading(true);
      if (totalPerPage > LIMIT) {
        const nextUsers = await getDaoArtists({
          id,
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

  const copyLink = (id: string) => {
    copy(`${location.origin}${ROUTE_PATH.DAO}?id=${id}&tab=1`);
    toast.remove();
    toast.success('Copied');
  };

  return (
    <div className={cn(className, s.users)}>
      <Row className={s.items_projects}>
        {isLoaded === false ? (
          <Col md={12}>
            {[...Array(LIMIT)].map((_, index) => (
              <SkeletonItem key={`token-loading-${index}`} />
            ))}
          </Col>
        ) : (
          <Col md={12}>
            <div className={s.users_header}>
              <div className="col-md-1">Proposal ID</div>
              <div className="col-md-3">Artist</div>
              <div className="col-md-2">Twitter</div>
              <div className="col-md-2">Expiration</div>
              <div className="col-md-2">Status</div>
              <div className="invisible col-md-3" />
            </div>

            {typeof isLoaded && combineList.length === 0 ? (
              <Empty content="No Data Available." />
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
                    <div className="col-md-3">
                      <div
                        className={cn(
                          'd-flex align-items-center',
                          s.users_pointer
                        )}
                      >
                        <a
                          className={s.users_link}
                          href={`${ROUTE_PATH.PROFILE}/${
                            item?.user?.wallet_address_btc_taproot ||
                            item?.user?.wallet_address
                          }`}
                          target="_blank"
                        >
                          <Image
                            className={s.users_avatar}
                            src={
                              convertIpfsToHttp(item?.user?.avatar) ||
                              DEFAULT_USER_AVATAR
                            }
                            width={48}
                            height={48}
                            alt={item?.user?.display_name}
                          />
                          <div>
                            <div>
                              {item?.user?.display_name ||
                                formatAddressDisplayName(
                                  item?.user?.wallet_address_btc_taproot
                                )}
                            </div>
                            {item?.user?.stats?.collection_created > 0 && (
                              <div className={s.users_collectionNum}>
                                {item?.user?.stats?.collection_created}{' '}
                                collection
                                {item?.user?.stats?.collection_created > 1 &&
                                  's'}
                              </div>
                            )}
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex">
                        {item?.user?.profile_social?.twitter ? (
                          <div>
                            <a
                              className={s.users_link}
                              title={item?.user?.display_name}
                              href={item?.user?.profile_social?.twitter}
                              target="_blank"
                            >
                              {item?.user?.profile_social?.twitter
                                ?.split('/')
                                .pop()}
                            </a>
                          </div>
                        ) : (
                          <span>-&nbsp;</span>
                        )}
                        {item?.user?.profile_social?.twitter &&
                          item?.user?.profile_social?.web && (
                            <span>&nbsp;-&nbsp;</span>
                          )}

                        {item?.user?.profile_social?.web ? (
                          <div>
                            <a
                              className={s.users_link}
                              title={item?.user?.display_name}
                              href={item?.user?.profile_social?.web}
                              target="_blank"
                            >
                              <span>Website</span>
                            </a>
                          </div>
                        ) : (
                          <span>&nbsp;-</span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">{`${dayjs(
                      item?.expired_at
                    ).format('MMM DD')}`}</div>
                    <div className="col-md-2">
                      {getStatusProposal(item?.status)}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                      <span
                        className={s.users_share}
                        onClick={() => copyLink(item?.id)}
                      >
                        <SvgInset
                          className={s.icCopy}
                          size={16}
                          svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                        />
                      </span>
                      {/* <Button
                        className={cn(s.users_btn, s.users_mr6)}
                        disabled={item?.action?.can_vote === false}
                        variant="outline-black"
                        onClick={() => submitVote(item?.id, 0)}
                      >
                        Report
                      </Button> */}
                      <Button
                        className={cn(s.users_btn, s.users_btnVote)}
                        disabled={item?.action?.can_vote === false}
                        onClick={() => submitVote(item?.id, 1)}
                      >
                        Verify ({item?.total_verify})
                      </Button>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default React.memo(UserItems);
