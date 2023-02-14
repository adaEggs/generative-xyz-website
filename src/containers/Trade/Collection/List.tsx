import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { IGetCollectionBtcListItem } from '@services/marketplace-btc';
import Card from '@containers/Trade/Collection/Card';

export const List = ({
  listData,
}: {
  listData?: IGetCollectionBtcListItem[];
}) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <div className="row">
          {listData?.map(project => (
            <Card
              className={'col-wide-2_5 col-xl-3 col-lg-5 col-6'}
              key={`project-item-${project.inscriptionID}`}
              project={project}
            />
          ))}
        </div>
      ) : (
        listData && (
          <Empty content="Bring your unique vision to life. List for sale now" />
        )
      )}
    </>
  );
};
