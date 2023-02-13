import ProjectListLoading from '@components/ProjectListLoading';
import React, { useState } from 'react';
import s from './styles.module.scss';

const BTCGenerativeList: React.FC = (): React.ReactElement => {
  const [isLoaded, _] = useState(false);

  return (
    <div className={s.btcGenerativeList}>
      <div className="container">
        {!isLoaded && <ProjectListLoading numOfItems={12} />}
        {/* {isLoaded && (
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
    </div>
  );
};

export default BTCGenerativeList;
