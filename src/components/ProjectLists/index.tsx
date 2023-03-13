import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { Project } from '@interfaces/project';
import { ProjectCard } from '@components/ProjectCard';

export const ProjectList = ({
  listData,
  colClass = 'col-wide-2_5 col-xl-3 col-lg-5 col-6',
}: {
  listData?: Project[];
  colClass?: string;
}) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <div className="row">
          {listData?.map(project => (
            <ProjectCard
              className={colClass}
              key={`project-item-${project.tokenID}`}
              project={project}
            />
          ))}
        </div>
      ) : (
        listData && <Empty content="Abracadabra" />
      )}
    </>
  );
};
