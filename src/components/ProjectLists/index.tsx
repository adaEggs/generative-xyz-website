import React from 'react';
import { Empty } from '@components/Collection/Empty';
import { Project } from '@interfaces/project';
import { ProjectCard } from '@components/ProjectCard';
import { COLS_CARD } from '@constants/breakpoint';

export const ProjectList = ({
  listData,
  colClass = COLS_CARD,
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
