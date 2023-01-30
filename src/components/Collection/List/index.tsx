import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import { useContext } from 'react';
import FilterOptions from '../FilterOptions';
import s from './CollectionList.module.scss';
import useWindowSize from '@hooks/useWindowSize';
import { v4 } from 'uuid';
import { Loading } from '@components/Loading';

const CollectionList = ({
  listData,
  projectInfo,
  isLoaded = true,
}: {
  listData?: Token[] | null;
  projectInfo?: Project | null;
  isLoaded?: boolean;
}) => {
  // useEffect(() => {
  //   const grid = document.querySelector(".grid");
  //   animateCSSGrid.wrapGrid(grid, { easing : 'backOut', stagger: 10, duration: 400 });
  // }, [])

  const { isMobile } = useWindowSize();

  const { showFilter, filterBuyNow } = useContext(
    GenerativeProjectDetailContext
  );

  return (
    <div className={`grid ${showFilter ? s.showFilter : 'grid-cols-1'}`}>
      {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
      {/* {listData && listData?.length > 0 ? ( */}
      <div className="position-relative">
        <div>
          <div
            style={
              !isLoaded
                ? {
                    width: '100%',
                    minHeight: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    zIndex: '1',
                    position: 'absolute',
                    top: '0',
                  }
                : {
                    visibility: 'hidden',
                    pointerEvents: 'none',
                  }
            }
          >
            <Loading isLoaded={isLoaded} className={s.projectDetail_loading} />
          </div>
        </div>
        <div
          className={`grid gap-24 ${
            isMobile
              ? 'grid-cols-2'
              : showFilter
              ? 'grid-cols-3'
              : 'grid-cols-4'
          }`}
        >
          {listData?.map(item => (
            <CollectionItem
              key={`collection-item-${v4()}`}
              data={item}
              filterBuyNow={filterBuyNow}
            />
          ))}
        </div>
        {listData?.length === 0 && <Empty projectInfo={projectInfo} />}
      </div>
    </div>
  );
};

export default CollectionList;
