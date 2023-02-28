import React from 'react';
import { Empty } from '@components/Collection/Empty';
import InscriptionCard from '../InscriptionCard';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { InscriptionItem } from '@interfaces/inscribe';

const InscriptionList = ({
  listData,
}: {
  listData: Array<InscriptionItem>;
}) => {
  return (
    <>
      {listData.length > 0 ? (
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            750: 2,
            900: 3,
            1240: 3,
            2500: 6,
            3000: 6,
          }}
        >
          <Masonry gutter="24px">
            {listData?.map((inscription, index) => (
              <InscriptionCard
                className={'col-12'}
                key={`project-item-${index}`}
                inscription={inscription}
                index={index}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <Empty content={'Abracadabra'} />
      )}
    </>
  );
};

export default InscriptionList;
