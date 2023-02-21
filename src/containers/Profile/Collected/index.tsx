import { Loading } from '@components/Loading';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectList } from '@containers/Trade/ProjectLists';
import useBTCSignOrd from '@hooks/useBTCSignOrd';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
import { getCollectedNFTs } from '@services/marketplace-btc';
import { isEmpty } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Collected.module.scss';

export const Collected = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ordAddress } = useBTCSignOrd();

  const [dataOrd, setdataOrd] = useState<IGetMarketplaceBtcListItem[]>([]);
  const currentBtcAddressRef = useRef(ordAddress);

  const fetchDataOrdinals = async () => {
    try {
      const res = await getCollectedNFTs(currentBtcAddressRef.current);
      setdataOrd(res || []);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };
  const debounceFetchDataOrdinals = debounce(fetchDataOrdinals, 300);

  useEffect(() => {
    if (!isEmpty(ordAddress) && currentBtcAddressRef.current !== ordAddress) {
      currentBtcAddressRef.current = ordAddress;
      debounceFetchDataOrdinals();
    }
  }, [ordAddress]);

  return (
    <div className={s.recentWorks}>
      <Row className={s.recentWorks_projects}>
        <Col xs={'12'}>
          {!isLoaded ? (
            <ProjectListLoading numOfItems={12} />
          ) : (
            <InfiniteScroll
              dataLength={dataOrd.length}
              next={debounceFetchDataOrdinals}
              className={s.recentWorks_projects_list}
              hasMore={true}
              loader={
                isLoading ? (
                  <div className={s.recentWorks_projects_loader}>
                    <Loading isLoaded={isLoading} />
                  </div>
                ) : null
              }
              endMessage={<></>}
            >
              <ProjectList isNFTBuy={false} listData={dataOrd} />
            </InfiniteScroll>
          )}
        </Col>
      </Row>
    </div>
  );
};
