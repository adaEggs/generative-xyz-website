import React from 'react';
import { Empty } from '@components/Collection/Empty';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ICollectedNFTItem } from '@interfaces/api/profile';
import { CollectedCard } from '../Card';
import s from './CollectedList.module.scss';

export const CollectedList = ({
  listData,
}: {
  listData?: ICollectedNFTItem[];
}) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            750: 2,
            900: 3,
            1240: 4,
            2500: 5,
            3000: 5,
          }}
        >
          <Masonry gutter="24px">
            {listData?.map((project, index) => (
              <CollectedCard
                className={'col-12'}
                key={`project-item-${project.inscriptionID}`}
                project={project}
                index={index}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        listData && <Empty className={s.list_empty} content={'Abracadabra'} />
      )}
    </>
  );
};
