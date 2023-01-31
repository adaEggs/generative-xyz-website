import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { Loading } from '@components/Loading';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import useWindowSize from '@hooks/useWindowSize';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import cs from 'classnames';
import { useContext } from 'react';
import FilterOptions from '../FilterOptions';
import s from './CollectionList.module.scss';

const CollectionList = ({
  listData,
  projectInfo,
  isLoaded = true,
}: {
  listData?: Token[] | null;
  projectInfo?: Project | null;
  isLoaded?: boolean;
}) => {
  const { isMobile } = useWindowSize();

  const { showFilter } = useContext(GenerativeProjectDetailContext);

  return (
    <div className={`grid  ${showFilter ? s.showFilter : 'grid-cols-1'}`}>
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
          className={cs(
            s.collectionList,
            `grid gap-24 animate-grid ${
              isMobile
                ? 'grid-cols-2'
                : showFilter
                ? 'grid-cols-3'
                : 'grid-cols-4'
            }`
          )}
        >
          {listData?.map((item, index) => (
            <CollectionItem key={index} data={item} />
          ))}
        </div>
        {listData?.length && (
          <Empty projectInfo={projectInfo} className={s.list_empty} />
        )}
      </div>
    </div>
  );
};

export default CollectionList;
