import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { ProjectCard } from '../ProjectCard';
import { IGetMarketplaceBtcListItem } from '@services/marketplace-btc';

export const ProjectList = ({
  listData,
}: {
  listData?: IGetMarketplaceBtcListItem[];
}) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <div className="row">
          {listData?.map(project => (
            <ProjectCard
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
