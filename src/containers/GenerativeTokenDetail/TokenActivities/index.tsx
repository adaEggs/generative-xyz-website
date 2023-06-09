import { GenerativeTokenDetailContext } from '@contexts/generative-token-detail-context';
import { useContext } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import OfferTable from './OfferTable';
import s from './styles.module.scss';
import TableActivities from './ActivitiesTable';

const TokenActivities = () => {
  const { tokenOffers } = useContext(GenerativeTokenDetailContext);

  return (
    <div className={s.wrapper}>
      <Tabs className={s.tabs} defaultActiveKey="activities">
        {tokenOffers && tokenOffers.length > 0 && (
          <Tab
            tabClassName={s.tab}
            eventKey="offers"
            title={`Offers (${tokenOffers.length})`}
          >
            <div className={s.activities_table}>
              <OfferTable></OfferTable>
            </div>
          </Tab>
        )}

        <Tab tabClassName={s.tab} eventKey="activities" title="Activities">
          <div className={s.activities_table}>
            <TableActivities></TableActivities>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default TokenActivities;
