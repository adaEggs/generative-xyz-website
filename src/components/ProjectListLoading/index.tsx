import ProjectCardSkeleton from '@components/ProjectCard/skeleton';
import useWindowSize from '@hooks/useWindowSize';
import { v4 } from 'uuid';

const ProjectListLoading = ({
  numOfItems = 8,
}: // cols = 4,
{
  numOfItems?: number;
  // cols?: number;
}) => {
  const { mobileScreen } = useWindowSize();

  return (
    <div
      className={`grid gap-24 ${
        mobileScreen ? 'grid-cols-2' : 'grid-auto-fit'
      }`}
    >
      {[...Array(numOfItems)].map(() => (
        <ProjectCardSkeleton key={`token-loading-${v4()}`} />
      ))}
    </div>
  );
};

export default ProjectListLoading;
