import CollectionItemSkeleton from '../Item/skeleton';
import s from './styles.module.scss';
import { COLS_CARD } from '@constants/breakpoint';

const CollectionListLoading = ({
  numOfItems = 8,
  showFilter,
}: {
  numOfItems?: number;
  showFilter?: boolean;
  maxFourCols?: boolean;
}) => {
  console.log('____showFilter', showFilter);
  return (
    <div className={`row ${s.list_loading}`}>
      {[...Array(numOfItems)].map((_, index) => (
        <CollectionItemSkeleton
          className={`${
            showFilter ? 'col-k2-2_5 col-xl-4 col-12' : COLS_CARD
          } `}
          key={`token-loading-${index}`}
        />
      ))}
    </div>
  );
};

export default CollectionListLoading;
