import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import ListViewItem from './Item';
import styles from './styles.module.scss';
import { TriggerLoad } from '@components/TriggerLoader';

const ListView = () => {
  const {
    listItems,
    // isLoaded,
    total,
    isNextPageLoaded,
    handleFetchNextPage,
    // showFilter,
  } = useContext(GenerativeProjectDetailContext);

  return (
    <div className={styles.table_wrapper}>
      <Table bordered>
        <thead>
          <tr>
            <th className={'checkbox'}>{/* <input type="checkbox" /> */}</th>
            <th>Item</th>
            <th>Owner</th>
            <th>Buy now</th>
          </tr>
        </thead>
        <tbody>
          {listItems &&
            listItems.length > 0 &&
            listItems.map((item, index) => (
              <>
                <ListViewItem key={index} data={item} />
              </>
            ))}
        </tbody>
      </Table>
      <TriggerLoad
        len={listItems?.length || 0}
        total={total || 0}
        isLoaded={isNextPageLoaded}
        onEnter={handleFetchNextPage}
      />
    </div>
  );
};

export default ListView;
