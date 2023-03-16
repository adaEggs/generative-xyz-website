import CollectionItemSkeleton from '../Item/skeleton';
import s from './styles.module.scss';

const CollectionListLoading = ({
  numOfItems = 8,
  showFilter,
  maxFourCols = false,
}: {
  numOfItems?: number;
  showFilter?: boolean;
  maxFourCols?: boolean;
}) => {
  return (
    <div className={`row ${s.list_loading}`}>
      {[...Array(numOfItems)].map((_, index) => (
        <CollectionItemSkeleton
          className={`${
            showFilter
              ? 'col-wide-3 col-xl-4 col-12'
              : `${!maxFourCols && 'col-wide-2_5'} col-xl-3 col-lg-4 col-12`
          } `}
          key={`token-loading-${index}`}
        />
      ))}
    </div>
  );
};

export default CollectionListLoading;
