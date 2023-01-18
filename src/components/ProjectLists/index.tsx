import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { Project } from '@interfaces/project';
import { ProjectCard } from '@components/ProjectCard';

export const ProjectList = ({ listData }: { listData?: Project[] }) => {
  return (
    <>
      {listData && listData?.length > 0 ? (
        <div className="grid grid-list">
          {listData?.map(project => (
            <ProjectCard
              key={`project-item-${project.tokenID}`}
              project={project}
            />
          ))}
        </div>
      ) : (
        listData && <Empty />
      )}
    </>
  );
};
