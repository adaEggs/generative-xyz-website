import ProjectCardSkeleton from '@components/ProjectCard/skeleton';
import { useId } from 'react';

const ProjectListLoading = ({ numOfItems = 8 }: { numOfItems?: number }) => {
  const id = useId();

  return (
    <div className="grid grid-list">
      {[...Array(numOfItems)].map(() => (
        <ProjectCardSkeleton key={id} />
      ))}
    </div>
  );
};

export default ProjectListLoading;
