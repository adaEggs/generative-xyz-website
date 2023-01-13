import React from 'react';
import CollectionItem from '@components/Collection/Item';
import { Empty } from '@components/Collection/Empty';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';

const CollectionList = ({
  listData,
  projectInfo,
  filterBuyNow,
}: {
  listData?: Token[];
  projectInfo?: Project;
  filterBuyNow?: boolean;
}) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <div className="grid grid-cols-4">
          {listData?.map((item, index: number) => (
            <CollectionItem
              key={`collection-item-${index}`}
              data={item}
              filterBuyNow={filterBuyNow}
            />
          ))}
        </div>
      ) : (
        listData && <Empty projectInfo={projectInfo} />
      )}
    </>
  );
};

export default CollectionList;
