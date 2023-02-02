import ProjectCardSkeleton from '@components/ProjectCard/skeleton';
import { v4 } from 'uuid';

const ProjectListLoading = ({ numOfItems = 12 }: { numOfItems?: number }) => {
  return (
    <div className={'row'}>
      {[...Array(numOfItems)].map(() => (
        <ProjectCardSkeleton
          className={'col-wide-2_5 col-xl-3 col-lg-5 col-6'}
          key={`token-loading-${v4()}`}
        />
      ))}
    </div>
  );
};

export default ProjectListLoading;
