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
        <div className={s.tokenListWrapper}>
          {!profileProjects?.total && (
            <Loading isLoaded={isLoadedProfileProjects} />
          )}
          <div className={s.tokenList}>
            <ProjectList
              colClass={'col-wide-3 col-xl-4 col-lg-5 col-6 d'}
              listData={profileProjects?.result}
            />
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
