import ProjectListLoading from '@components/ProjectListLoading';
import { ProfileContext } from '@contexts/profile-context';
import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import s from './styles.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loading } from '@components/Loading';
import debounce from 'lodash/debounce';
import InscriptionList from './InscriptionList';

const FreeInscriptions: React.FC = (): React.ReactElement => {
  const {
    isLoadingFree,
    freeInscriptions,
    totalFreeInscription,
    handleFetchFreeInscriptions,
  } = useContext(ProfileContext);

  const debounceFetchData = debounce(handleFetchFreeInscriptions, 300);

  return (
    <Row className={s.freeInscriptions}>
      <Col xs={'12'}>
        <InfiniteScroll
          dataLength={totalFreeInscription}
          next={debounceFetchData}
          className={s.projectList}
          hasMore={true}
          loader={
            isLoadingFree ? (
              <div className={s.loadingWrapper}>
                <Loading isLoaded={false} />
              </div>
            ) : null
          }
          endMessage={<></>}
        >
          <InscriptionList listData={freeInscriptions} />
        </InfiniteScroll>
        {isLoadingFree && <ProjectListLoading numOfItems={12} />}
      </Col>
    </Row>
  );
};

export default FreeInscriptions;
