import ProjectCardSkeleton from '@components/ProjectCard/skeleton';

const ProjectListLoading = ({ numOfItems = 12 }: { numOfItems?: number }) => {
  return (
    <div className={'row'}>
      {[...Array(numOfItems)].map((_, index) => (
        <ProjectCardSkeleton
          className={'col-k2-2 col-wide-2_5 col-xl-3 col-lg-5 col-sm-6 col-12'}
          key={`token-loading-${index}`}
        />
      ))}
    </div>
  );
};

export default ProjectListLoading;
