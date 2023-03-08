import { Loading } from '@components/Loading';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProfileContext } from '@contexts/profile-context';
import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Collected.module.scss';
import { CollectedList } from './List';
import { debounce } from 'lodash';

export const Collected = (): JSX.Element => {
  const { isLoadingProfileCollected, collectedNFTs, isLoadedProfileCollected } =
    useContext(ProfileContext);

  const [page, setPage] = React.useState(1);

  const _collectedNFTs = React.useMemo(() => {
    if (!collectedNFTs || !collectedNFTs.length) return [];
    return collectedNFTs.slice(0, page * 20);
  }, [page, collectedNFTs]);

  const debounceSetPage = React.useCallback(
    debounce((page: number) => {
      setPage(page + 1);
    }, 1000),
    []
  );

  return (
    <div className={s.recentWorks}>
      <Row className={s.recentWorks_projects}>
        <Col xs={'12'}>
          {!isLoadedProfileCollected ? (
            <ProjectListLoading numOfItems={12} />
          ) : (
            <InfiniteScroll
              dataLength={_collectedNFTs.length}
              next={() => {
                debounceSetPage(page);
              }}
              className={s.recentWorks_projects_list}
              hasMore={true}
              loader={
                isLoadingProfileCollected ? (
                  <div className={s.recentWorks_projects_loader}>
                    <Loading isLoaded={isLoadedProfileCollected} />
                  </div>
                ) : null
              }
              endMessage={<></>}
            >
              <CollectedList
                columnsCountBreakPoints={{
                  350: 1,
                  750: 2,
                  900: 2,
                  1240: 3,
                  2500: 4,
                  3000: 4,
                }}
                listData={_collectedNFTs}
              />
            </InfiniteScroll>
          )}
        </Col>
      </Row>
    </div>
  );
};
