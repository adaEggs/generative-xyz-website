import React, { useState, useEffect } from 'react';
import Table from '@components/Table';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { ICollection } from '@interfaces/shop';
import InfiniteScroll from 'react-infinite-scroll-component';
// import cs from 'classnames';
import { formatBTCPrice } from '@utils/format';
import { getCollectionList } from '@services/shop';
import _uniqBy from 'lodash/uniqBy';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

const TABLE_HEADINGS = [
  'Name',
  'Floor price',
  // '1D change',
  // '7D change',
  // '15M volume',
  // '1D volume',
  // '7D volume',
  'Volume',
  'Owners',
  'Supply',
];

const LOG_PREFIX = 'CollectionTab';

const Collection: React.FC = (): React.ReactElement => {
  const [collectionList, setCollections] = useState<Array<ICollection>>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const tableData = collectionList.map(collection => {
    return {
      id: collection.project.tokenId,
      render: {
        name: (
          <div className={s.name}>
            <img
              className={s.projectThumbnail}
              src={collection.project.thumbnail}
              alt={collection.project.name}
            />
            <div className={s.projectInfo}>
              <p className={s.owner}>{collection.owner?.displayName}</p>
              <p className={s.collectionName}>{collection.project.name}</p>
            </div>
          </div>
        ),
        floorPrice: (
          <div className={s.floorPrice}>
            <span>
              &#8383;{' '}
              {formatBTCPrice(
                collection.projectMarketplaceData.floor_price,
                '0.00'
              )}
            </span>
          </div>
        ),
        // oneDayChange: (
        //   <div
        //     className={cs(s.oneDayChange, {
        //       negative: collection.floorPriceOneDay.percentageChanged < 0,
        //       positive: collection.floorPriceOneDay.percentageChanged > 0,
        //     })}
        //   >
        //     {`${collection.floorPriceOneDay.percentageChanged <= 0 ? '' : '+'}${
        //       collection.floorPriceOneDay.percentageChanged
        //     }%`}
        //   </div>
        // ),
        // oneWeekChange: (
        //   <div
        //     className={cs(s.oneWeekChange, {
        //       negative: collection.floorPriceOneWeek.percentageChanged < 0,
        //       positive: collection.floorPriceOneWeek.percentageChanged > 0,
        //     })}
        //   >
        //     {`${
        //       collection.floorPriceOneWeek.percentageChanged <= 0 ? '' : '+'
        //     }${collection.floorPriceOneWeek.percentageChanged}%`}
        //   </div>
        // ),
        // volume15M: (
        //   <div className={s.volume15M}>
        //     <span>
        //       &#8383;{' '}
        //       {formatCurrency(
        //         parseFloat(collection.volumeFifteenMinutes.amount)
        //       )}
        //     </span>
        //   </div>
        // ),
        // volume1D: (
        //   <div className={s.volume1D}>
        //     <span>
        //       &#8383;{' '}
        //       {formatCurrency(parseFloat(collection.volumeOneDay.amount))}
        //     </span>
        //   </div>
        // ),
        // volume7D: (
        //   <div className={s.volume7D}>
        //     <span>
        //       &#8383;{' '}
        //       {formatCurrency(parseFloat(collection.volumeOneWeek.amount))}
        //     </span>
        //   </div>
        // ),
        volume: (
          <div className={s.volume7D}>
            <span>
              &#8383;{' '}
              {formatBTCPrice(collection.projectMarketplaceData.volume, '0.00')}
            </span>
          </div>
        ),
        owners: (
          <div className={s.owners}>
            {`${collection.numberOwners.toLocaleString()} (${
              collection.numberOwnersPercentage
            }%)`}
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

  const handleFetchCollections = async (): Promise<void> => {
    try {
      const newPage = page + 1;
      const { result, total } = await getCollectionList({
        limit: 15,
        page: newPage,
      });
      if (result && Array.isArray(result)) {
        const newList = _uniqBy(
          [...collectionList, ...result],
          nft => nft.project.contractAddress + nft.project.tokenId
        );
        setCollections(newList);
      }
      setPage(newPage);
      setTotal(total);
    } catch (err: unknown) {
      log('can not fetch data', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  useEffect(() => {
    handleFetchCollections();
  }, []);

  return (
    <div className={s.collection}>
      <InfiniteScroll
        dataLength={collectionList.length}
        next={handleFetchCollections}
        className={s.collectionScroller}
        hasMore={collectionList.length < total}
        loader={
          <div className={s.loadingWrapper}>
            <Loading isLoaded={false} />
          </div>
        }
        endMessage={<></>}
      >
        <Table
          responsive
          className={s.dataTable}
          tableHead={TABLE_HEADINGS}
          data={tableData}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Collection;