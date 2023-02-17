import { useEffect, useState } from 'react';

import Heading from '@components/Heading';
import ListForSaleModal from '@containers/Trade/ListForSaleModal';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectList } from '@containers/Trade/ProjectLists';
import { Loading } from '@components/Loading';
import { getMarketplaceBtcList } from '@services/marketplace-btc';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './RecentWorks.module.scss';
import ButtonIcon from '@components/ButtonIcon';
import { Container } from 'react-bootstrap';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';

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

  useEffect(() => {
    debounceFetchData();
  }, []);

  return (
    <div className={s.recentWorks}>
      <div className={s.banner}>
        <Heading as="h4" fontWeight="semibold" color="white">
          The easiest way to buy and sell Bitcoin NFTs
        </Heading>
        <ButtonIcon
          sizes="large"
          variants="secondary"
          className={s.banner_btn}
          onClick={() => setShowModal(true)}
        >
          List for sale
        </ButtonIcon>
      </div>
      <Container>
        <Row className={s.recentWorks_projects}>
          <Col xs={'12'}>
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
          </Col>
        </Row>
      </Container>
      <ListForSaleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
