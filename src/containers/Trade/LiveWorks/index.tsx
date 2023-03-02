import { useEffect, useState } from 'react';

import Heading from '@components/Heading';
import ListForSaleModal from '@containers/Trade/ListForSaleModal';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
import { ProjectList } from '@containers/Trade/ProjectLists';

import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import { ROUTE_PATH } from '@constants/route-path';
import { getListingOrdinals } from '@services/marketplace-btc';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './LiveWorks.module.scss';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
import useBTCSignOrd from '@hooks/useBTCSignOrd';

export const LiveWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const { ordAddress, onButtonClick } = useBTCSignOrd();

  const onShowModal = () => {
    onButtonClick({
      cbSigned: () => setShowModal(true),
    })
      .then()
      .catch();
  };

  const router = useRouter();
  const goToInscriptionsPage = () => {
    router.push(ROUTE_PATH.INSCRIBE);
  };
  const [dataOrd, setdataOrd] = useState<IGetMarketplaceBtcListItem[]>([]);
  const [fromOrd, setFromOrd] = useState(0);
  const fetchDataOrdinals = async () => {
    try {
      setIsLoaded(true);
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
    debounceFetchDataOrdinals();
  }, []);

  return (
    <div className={s.recentWorks}>
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
            onClick={onShowModal}
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
      {!!ordAddress && showModal && (
        <ListForSaleModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          ordAddress={ordAddress}
        />
      )}
    </div>
  );
};
