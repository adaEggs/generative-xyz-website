import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { ProjectCard } from '../ProjectCard';
import { ProjectCardOrd } from '../ProjectCardOrd';
import { IGetMarketplaceBtcListItem } from '@services/marketplace-btc';

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
        <div className="row">
          {listData?.map(project =>
            isNFTBuy ? (
              <ProjectCard
                className={'col-wide-2_5 col-xl-2 col-lg-5 col-6'}
                key={`project-item-${project.inscriptionID}`}
                project={project}
              />
            ) : (
              <ProjectCardOrd
                className={'col-wide-2_5 col-xl-2 col-lg-5 col-6'}
                key={`project-item-${project.inscriptionID}`}
                project={project}
              />
            )
          )}
        </div>
      ) : (
        listData && <Empty content="Be the first to mint this collection" />
      )}
    </>
  );
};
