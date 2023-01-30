import { Loading } from '@components/Loading';
import { ProjectList } from '@components/ProjectLists';
import { TriggerLoad } from '@components/TriggerLoader';
import { ProfileContext } from '@contexts/profile-context';
import { useContext } from 'react';
import s from './Created.module.scss';

export const CreatedTab = (): JSX.Element => {
  const { isLoadedProfileProjects, profileProjects, handleFetchProjects } =
    useContext(ProfileContext);

  return (
    <>
      <div className={s.tabContent}>
        <div className={s.filterWrapper}>
          {/* <TokenTopFilter
            keyword=""
            sort=""
            onKeyWordChange={() => {
              //
            }}
            onSortChange={() => {
              //
            }}
          /> */}
        </div>
        <div className={s.tokenListWrapper}>
          {!profileProjects?.total && (
            <Loading isLoaded={isLoadedProfileProjects} />
          )}
          <div className={s.tokenList}>
            <ProjectList listData={profileProjects?.result} />
            <TriggerLoad
              len={profileProjects?.result.length || 0}
              total={profileProjects?.total || 0}
              isLoaded={isLoadedProfileProjects}
              onEnter={handleFetchProjects}
            />
          </div>
        </div>
      </div>
    </>
  );
};
