import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { ProjectCard } from '../ProjectCard';
import { ProjectCardOrd } from '../ProjectCardOrd';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';

export const ProjectList = ({
  listData,
  isNFTBuy,
}: {
  listData?: IGetMarketplaceBtcListItem[];
  isNFTBuy: boolean;
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
            3000: 6,
          }}
        >
          <Masonry gutter="24px">
            {listData?.map((project, index) =>
              isNFTBuy ? (
                <ProjectCard
                  className={'col-12'}
                  key={`project-item-${index}`}
                  project={project}
                  index={index}
                />
              ) : (
                <ProjectCardOrd
                  className={'col-12'}
                  key={`project-item-${index}`}
                  project={project}
                  index={index}
                />
              )
            )}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        listData && (
          <Empty
            content={
              isNFTBuy ? 'Be the first to mint this collection' : 'Abracadabra'
            }
          />
        )
      )}
    </>
  );
};
