import React from 'react';
import s from './styles.module.scss';

const BTCGenerativeList: React.FC = (): React.ReactElement => {
  return (
    <div className={s.btcGenerativeList}>
      {/* {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {isLoaded && (
          <div className={s.recentWorks_projects_list}>
            <ProjectList listData={listData} />
            <TriggerLoad
              len={listData.length || 0}
              total={currentTotal || 0}
              isLoaded={isLoadedMore}
              onEnter={onLoadMore}
            />
          </div>
        )} */}
    </div>
  );
};

export default BTCGenerativeList;
