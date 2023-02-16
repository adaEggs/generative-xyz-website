import { useEffect, useState } from 'react';

import Heading from '@components/Heading';
import ListForSaleModal from '@containers/Trade/ListForSaleModal';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectList } from '@containers/Trade/ProjectLists';

import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import { ROUTE_PATH } from '@constants/route-path';
import {
  getListingOrdinals,
  getMarketplaceBtcList,
  IGetMarketplaceBtcListItem,
} from '@services/marketplace-btc';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import { Tab, Tabs } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './RecentWorks.module.scss';

const LIMIT = 20;

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [listData, setListData] = useState<IGetMarketplaceBtcListItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const tmpList = await getMarketplaceBtcList({
        limit: LIMIT,
        offset: listData.length || 0,
        'buyable-only': false,
      });

      if (!tmpList || !tmpList.length) return setIsLoaded(true);
      const newList = uniqBy(
        [...listData, ...tmpList],
        item => item.inscriptionID
      );

      setListData(newList || []);
      setIsLoaded(true);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };

  const debounceFetchData = debounce(fetchData, 300);

  const router = useRouter();
  const goToInscriptionsPage = () => {
    router.push(ROUTE_PATH.INSCRIBE);
  };
  // const [isNFTBuy, setIsNFTBuy] = useState(false);
  // const handleChangeType = () => {
  //   setIsNFTBuy(!isNFTBuy);
  // };
  const [dataOrd, setdataOrd] = useState<IGetMarketplaceBtcListItem[]>([]);
  const [fromOrd, setFromOrd] = useState(0);
  const fetchDataOrdinals = async () => {
    try {
      const res = await getListingOrdinals(fromOrd);
      setFromOrd(res.prev);
      const newList = uniqBy(
        [...dataOrd, ...res.data],
        item => item.inscriptionID
      );

      setdataOrd(newList || []);
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
    }
  };
  const debounceFetchDataOrdinals = debounce(fetchDataOrdinals, 300);

  useEffect(() => {
    debounceFetchData();
    debounceFetchDataOrdinals();
  }, []);

  return (
    <div className={s.recentWorks}>
      {/* <Row style={{ justifyContent: 'center' }}>
        <Col xs={'auto'}>
          <Heading as="h4" fontWeight="semibold">
            Bitcoin NFTs. Browse. Curate. Purchase
          </Heading>
        </Col>
      </Row> */}
      <Row style={{ justifyContent: 'space-between' }}>
        <Col
          xs={'auto'}
          style={{ display: 'flex', alignItems: 'center', margin: 0 }}
        >
          <Heading as="h4" fontWeight="semibold">
            Explore Bitcoin NFTs
          </Heading>
        </Col>
        <Col
          xs={'auto'}
          style={{ display: 'flex', margin: 0 }}
          className={s.wrap_btn}
        >
          <ButtonIcon
            sizes="large"
            className={s.recentWorks_btn}
            onClick={() => setShowModal(true)}
          >
            List for sale
          </ButtonIcon>
          <ButtonIcon
            className={s.recentWorks_btnIns}
            onClick={goToInscriptionsPage}
            sizes="large"
            variants="outline"
          >
            Inscribe for free
          </ButtonIcon>
        </Col>
      </Row>
      <Row className={s.recentWorks_projects}>
        <Col xs={'12'}>
          <Tabs className={s.tabs} defaultActiveKey="buyNow">
            <Tab tabClassName={s.tab} eventKey="buyNow" title={`Buy Now`}>
              {!isLoaded ? (
                <ProjectListLoading numOfItems={12} />
              ) : (
                <InfiniteScroll
                  dataLength={listData.length}
                  next={debounceFetchData}
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
                  <ProjectList isNFTBuy={true} listData={listData} />
                </InfiniteScroll>
              )}
            </Tab>
            <Tab
              tabClassName={s.tab}
              eventKey="everything"
              title={`Everything`}
            >
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
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <ListForSaleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
