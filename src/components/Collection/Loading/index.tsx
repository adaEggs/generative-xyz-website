import { v4 } from 'uuid';
import CollectionItemSkeleton from '../Item/skeleton';

const CollectionListLoading = ({
  numOfItems = 8,
  showFilter,
}: {
  numOfItems?: number;
  showFilter?: boolean;
}) => {
  return (
    <div className={`row`}>
      {[...Array(numOfItems)].map(() => (
        <CollectionItemSkeleton
          className={`${
            showFilter
              ? 'col-wide-3 col-xl-4 col-6'
              : 'col-wide-2_5 col-xl-3 col-lg-4 col-6'
          } `}
          key={`token-loading-${v4()}`}
        />
      ))}
    </div>
  );
};

export default CollectionListLoading;
