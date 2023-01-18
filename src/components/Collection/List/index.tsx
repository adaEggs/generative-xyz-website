import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { useContext } from 'react';
import FilterOptions from '../FilterOptions';
import s from './CollectionList.module.scss';

const CollectionList = ({
  listData,
  projectInfo,
}: {
  listData?: Token[];
  projectInfo?: Project | null;
}) => {
  // useEffect(() => {
  //   const grid = document.querySelector(".grid");
  //   animateCSSGrid.wrapGrid(grid, { easing : 'backOut', stagger: 10, duration: 400 });
  // }, [])

  const { showFilter, filterBuyNow } = useContext(
    GenerativeProjectDetailContext
  );

  return (
    <div className={`grid ${showFilter ? s.showFilter : 'grid-cols-1'}`}>
      {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
      {listData && listData?.length > 0 ? (
        <div
          className={`grid gap-24 ${
            showFilter ? 'grid-cols-3' : 'grid-cols-4'
          }`}
        >
          {listData?.map(item => (
            <CollectionItem
              key={`collection-item-${item.tokenID}`}
              data={item}
              filterBuyNow={filterBuyNow}
            />
          ))}
        </div>
      ) : (
        listData && <Empty projectInfo={projectInfo} />
      )}
    </div>
  );
};

export default CollectionList;
