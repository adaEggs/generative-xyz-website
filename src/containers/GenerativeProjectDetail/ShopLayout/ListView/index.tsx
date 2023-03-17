import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import ListViewItem from './Item';
import styles from './styles.module.scss';
import { TriggerLoad } from '@components/TriggerLoader';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import Text from '@components/Text';
import cs from 'classnames';
import ButtonIcon from '@components/ButtonIcon';
import s from '@components/Collection/List/CollectionList.module.scss';

const ListView = () => {
  const {
    listItems,
    selectedOrders,
    removeAllOrders,
    selectAllOrders,
    // isLoaded,
    total,
    isNextPageLoaded,
    handleFetchNextPage,
    marketplaceData,
    filterTraits,
    setFilterTraits,
    projectData,
    // showFilter,
  } = useContext(GenerativeProjectDetailContext);

  const onClickItems = () => {
    selectedOrders.length > 0 ? removeAllOrders() : selectAllOrders();
  };

  const titleItems =
    selectedOrders.length > 0
      ? `${selectedOrders.length}${
          marketplaceData?.listed
            ? ` / ${marketplaceData?.listed} Selected`
            : ''
        }`
      : `${
          marketplaceData?.listed
            ? `${marketplaceData?.listed} Listed`
            : 'Items'
        }`;

  const handleRemoveFilter = (trait: string) => {
    const newFilterTraits = filterTraits
      .split(',')
      .filter(item => item !== trait)
      .join(',');
    setFilterTraits(newFilterTraits);
  };

  return (
    <div className={styles.wrapper}>
      {filterTraits && filterTraits.length > 0 && (
        <div className={s.filterList}>
          {filterTraits.split(',').map((trait, index) => (
            <div
              key={`trait-${projectData?.tokenID}-${index}`}
              className={cs(s.filterItem, 'd-flex align-items-center')}
            >
              <Text>{`${trait.split(':')[0]}: ${trait.split(':')[1]}`}</Text>
              <SvgInset
                size={8}
                svgUrl={`${CDN_URL}/icons/ic-close.svg`}
                className={cs(s.removeIcon, 'cursor-pointer')}
                onClick={() => {
                  handleRemoveFilter(trait);
                }}
              />
            </div>
          ))}
          <ButtonIcon onClick={() => setFilterTraits('')}>Clear all</ButtonIcon>
        </div>
      )}
      <div className={styles.table_wrapper}>
        <Table bordered>
          <thead>
            <tr>
              <th className={styles.checkbox}>
                <SvgInset
                  key=""
                  size={14}
                  svgUrl={`${CDN_URL}/icons/${
                    selectedOrders.length > 0 ? 'ic_checkboxed' : 'ic_checkbox'
                  }.svg`}
                  onClick={onClickItems}
                  className={styles.checkbox}
                />
              </th>
              <th>{titleItems}</th>
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
    </div>
  );
};

export default ListView;
