import CollectionList from '@components/Collection/List';
import { Loading } from '@components/Loading';
import { TriggerLoad } from '@components/TriggerLoader';
import { ProfileContext } from '@contexts/profile-context';
import { useContext } from 'react';
import s from './Owned.module.scss';

export const OwnedTab = (): JSX.Element => {
  const { isLoadedProfileTokens, profileTokens, handleFetchTokens } =
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
          {!profileTokens?.total && (
            <Loading isLoaded={isLoadedProfileTokens} />
          )}
          <div className={s.tokenList}>
            <CollectionList listData={profileTokens?.result} />
            <TriggerLoad
              len={profileTokens?.result.length || 0}
              total={profileTokens?.total || 0}
              isLoaded={isLoadedProfileTokens}
              onEnter={handleFetchTokens}
            />
          </div>
        </div>
      </div>
    </>
  );
};
