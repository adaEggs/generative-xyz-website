import { Loading } from '@components/Loading';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProfileContext } from '@contexts/profile-context';
import { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Collected.module.scss';
import { CollectedList } from './List';

export const Collected = (): JSX.Element => {
  const {
    isLoadingProfileCollected,
    collectedNFTs,
    debounceFetchDataCollectedNFTs,
    isLoadedProfileCollected,
  } = useContext(ProfileContext);

  return (
    <div className={s.recentWorks}>
      <Row className={s.recentWorks_projects}>
        <Col xs={'12'}>
          {!isLoadedProfileCollected ? (
            <ProjectListLoading numOfItems={12} />
          ) : (
            <InfiniteScroll
              dataLength={collectedNFTs.length}
              next={debounceFetchDataCollectedNFTs}
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
              <CollectedList listData={collectedNFTs} />
            </InfiniteScroll>
          )}
        </Col>
      </Row>
    </div>
  );
};
