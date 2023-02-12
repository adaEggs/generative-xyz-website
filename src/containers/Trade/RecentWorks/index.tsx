import { useState, useEffect } from 'react';

import Heading from '@components/Heading';
import ProjectListLoading from '../ProjectListLoading';
import { ProjectList } from '../ProjectLists';
import ListForSaleModal from '../ListForSaleModal';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import s from './RecentWorks.module.scss';
import { Button } from 'react-bootstrap';
import {
  getMarketplaceBtcList,
  IGetMarketplaceBtcListItem,
} from '@services/marketplace-btc';
import { toast } from 'react-hot-toast';

export const RecentWorks = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [listData, setListData] = useState<IGetMarketplaceBtcListItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getListAll = async () => {
    try {
      const tmpList = await getMarketplaceBtcList({
        page: 1,
      });

      if (tmpList) {
        setListData(tmpList || []);
        setIsLoaded(true);
      } else {
        toast.error('Get List error');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    getListAll();
  }, []);

  return (
    <div className={s.recentWorks}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col xs={'auto'}>
          <Heading as="h4" fontWeight="semibold">
            Trade
          </Heading>
        </Col>
        <Col xs={'auto'}>
          <Button
            className={s.recentWorks_btn}
            size="lg"
            onClick={() => setShowModal(true)}
          >
            List for sale
          </Button>
        </Col>
      </Row>
      <Row className={s.recentWorks_projects}>
        {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {isLoaded && (
          <div className={s.recentWorks_projects_list}>
            <ProjectList listData={listData} />
          </div>
        )}
      </Row>
      <ListForSaleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
