import { v4 } from 'uuid';
import CollectionItemSkeleton from '../Item/skeleton';

const CollectionListLoading = ({
  numOfItems = 8,
  cols = 4,
}: {
  numOfItems?: number;
  cols?: number;
}) => {
  return (
    <div className={`grid grid-cols-${cols} gap-24`}>
      {[...Array(numOfItems)].map(() => (
        <CollectionItemSkeleton key={`token-loading-${v4()}`} />
      ))}
    </div>
  );
};

export default CollectionListLoading;
