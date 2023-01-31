import ProjectCardSkeleton from '@components/ProjectCard/skeleton';

const ProjectListLoading = () => {
  return (
    <div className="grid grid-list">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
};

export default ProjectListLoading;
