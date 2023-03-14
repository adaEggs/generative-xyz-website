import { RecentWorks } from '@containers/Marketplace/RecentWorks';

import s from './Marketplace.module.scss';
const Marketplace = () => {
  return (
    <>
      <div className={s.marketplaceContainer_recentWorks}>
        <RecentWorks />
      </div>
    </>
  );
};

export default Marketplace;
