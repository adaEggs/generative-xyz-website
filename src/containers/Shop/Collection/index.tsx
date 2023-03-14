import React, { useState } from 'react';
import Table from '@components/Table';
import useAsyncEffect from 'use-async-effect';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import Image from 'next/image';
import { CDN_URL } from '@constants/config';
import { ICollection } from '@interfaces/shop';
import cs from 'classnames';

const TABLE_HEADINGS = [
  'Name',
  'Floor price',
  '1D change',
  '7D change',
  '15M volume',
  '1D volume',
  '7D volume',
  'Owners',
  'Supply',
];

const Collection: React.FC = (): React.ReactElement => {
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableData = collections.map(collection => {
    return {
      id: collection.contractAddress,
      render: {
        name: (
          <div className={s.name}>
            <img src="" alt={collection.project.name} />
          </div>
        ),
        floorPrice: (
          <div className={s.floorPrice}>
            <Image
              src={`${CDN_URL}/icons/ic-btc-1-16x16.svg`}
              width={16}
              height={16}
              alt="btc"
            />
            <span>{collection.floorPrice.amount}</span>
          </div>
        ),
        oneDayChange: (
          <div
            className={cs(s.oneDayChange, {
              negative: collection.floorPriceOneDay.percentageChanged < 0,
              positive: collection.floorPriceOneDay.percentageChanged > 0,
            })}
          >
            {`${collection.floorPriceOneDay.percentageChanged}%`}
          </div>
        ),
        oneWeekChange: (
          <div
            className={cs(s.oneWeekChange, {
              negative: collection.floorPriceOneWeek.percentageChanged < 0,
              positive: collection.floorPriceOneWeek.percentageChanged > 0,
            })}
          >
            {`${collection.floorPriceOneWeek.percentageChanged}%`}
          </div>
        ),
        volume15M: (
          <div className={s.volume15M}>
            <Image
              src={`${CDN_URL}/icons/ic-btc-1-16x16.svg`}
              width={16}
              height={16}
              alt="btc"
            />
            <span>{collection.volumeFifteenMinutes.amount}</span>
          </div>
        ),
        volume1D: (
          <div className={s.volume1D}>
            <Image
              src={`${CDN_URL}/icons/ic-btc-1-16x16.svg`}
              width={16}
              height={16}
              alt="btc"
            />
            <span>{collection.volumeOneDay.amount}</span>
          </div>
        ),
        volume7D: (
          <div className={s.volume7D}>
            <Image
              src={`${CDN_URL}/icons/ic-btc-1-16x16.svg`}
              width={16}
              height={16}
              alt="btc"
            />
            <span>{collection.volumeOneWeek.amount}</span>
          </div>
        ),
        owners: (
          <div className={s.owners}>
            {`${collection.numberOwners} (${collection.numberOwnersPercentage}%)`}
          </div>
        ),
        supply: (
          <div className={s.owners}>
            {collection.totalSupply.toLocaleString()}
          </div>
        ),
      },
    };
  });

  useAsyncEffect(() => {
    // TODO fetch data
    setIsLoading(false);
    setCollections([]);
  }, []);

  return (
    <div className={s.collection}>
      {isLoading ? (
        <Loading isLoaded={false} />
      ) : (
        <Table
          responsive
          className={s.dataTable}
          tableHead={TABLE_HEADINGS}
          data={tableData}
        ></Table>
      )}
    </div>
  );
};

export default Collection;
