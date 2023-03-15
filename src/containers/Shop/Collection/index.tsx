import React, { useState, useEffect } from 'react';
import Table from '@components/Table';
import s from './styles.module.scss';
import { Loading } from '@components/Loading';
import { ICollection } from '@interfaces/shop';
import InfiniteScroll from 'react-infinite-scroll-component';
import cs from 'classnames';
import { formatCurrency } from '@utils/format';

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

const SAMPLE_DATA: ICollection = {
  contractAddress: '0x00',
  project: {
    name: 'Timechain Timechain Timechain Timechain Timechain Timechain Timechain Timechain Timechain ',
    tokenId: '0x123',
    thumbnail:
      'https://cdn.generative.xyz/upload/1678089979922719472-gansypollockandkandinskystyle703929b280804b128fe586ced783eae5denoiseaistandardsharpenaistandard.jpg',
  },
  totalSupply: 1200,
  numberOwners: 213,
  numberOwnersPercentage: 54,
  floorPrice: {
    amount: '120',
  },
  floorPriceOneDay: {
    amount: '130',
    percentageChanged: 4.2,
  },
  floorPriceOneWeek: {
    amount: '150',
    percentageChanged: 4.2,
  },
  volumeFifteenMinutes: {
    amount: '120',
  },
  volumeOneDay: {
    amount: '1220',
  },
  volumeOneWeek: {
    amount: '90123',
  },
  owner: {
    name: 'Naruto Naruto Naruto Naruto Naruto Naruto Naruto Naruto Naruto ',
  },
};

const Collection: React.FC = (): React.ReactElement => {
  const [collectionList, setCollections] = useState<Array<ICollection>>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const tableData = collectionList.map(collection => {
    return {
      id: collection.contractAddress,
      render: {
        name: (
          <div className={s.name}>
            <img
              className={s.projectThumbnail}
              src={collection.project.thumbnail}
              alt={collection.project.name}
            />
            <div className={s.projectInfo}>
              <p className={s.owner}>{collection.owner.name}</p>
              <p className={s.collectionName}>{collection.project.name}</p>
            </div>
          </div>
        ),
        floorPrice: (
          <div className={s.floorPrice}>
            <span>
              &#8383; {formatCurrency(parseFloat(collection.floorPrice.amount))}
            </span>
          </div>
        ),
        oneDayChange: (
          <div
            className={cs(s.oneDayChange, {
              negative: collection.floorPriceOneDay.percentageChanged < 0,
              positive: collection.floorPriceOneDay.percentageChanged > 0,
            })}
          >
            {`${collection.floorPriceOneDay.percentageChanged <= 0 ? '' : '+'}${
              collection.floorPriceOneDay.percentageChanged
            }%`}
          </div>
        ),
        oneWeekChange: (
          <div
            className={cs(s.oneWeekChange, {
              negative: collection.floorPriceOneWeek.percentageChanged < 0,
              positive: collection.floorPriceOneWeek.percentageChanged > 0,
            })}
          >
            {`${
              collection.floorPriceOneWeek.percentageChanged <= 0 ? '' : '+'
            }${collection.floorPriceOneWeek.percentageChanged}%`}
          </div>
        ),
        volume15M: (
          <div className={s.volume15M}>
            <span>
              &#8383;{' '}
              {formatCurrency(
                parseFloat(collection.volumeFifteenMinutes.amount)
              )}
            </span>
          </div>
        ),
        volume1D: (
          <div className={s.volume1D}>
            <span>
              &#8383;{' '}
              {formatCurrency(parseFloat(collection.volumeOneDay.amount))}
            </span>
          </div>
        ),
        volume7D: (
          <div className={s.volume7D}>
            <span>
              &#8383;{' '}
              {formatCurrency(parseFloat(collection.volumeOneWeek.amount))}
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

  const handleLoadCollection = async (): Promise<void> => {
    // TODO fetch data
    setTotal(100);
    const newPage = page + 1;
    setPage(newPage);
    const sampleList = [
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
      SAMPLE_DATA,
    ];
    setCollections(prev => [...prev, ...sampleList]);
  };

  useEffect(() => {
    handleLoadCollection();
  }, []);

  return (
    <div className={s.collection}>
      <InfiniteScroll
        dataLength={collectionList.length}
        next={handleLoadCollection}
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
