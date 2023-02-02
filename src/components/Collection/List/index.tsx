import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import useWindowSize from '@hooks/useWindowSize';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import cs from 'classnames';
import { useContext } from 'react';
import FilterOptions from '../FilterOptions';
import CollectionListLoading from '../Loading';
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
  const { mobileScreen } = useWindowSize();

  const { showFilter } = useContext(GenerativeProjectDetailContext);

  return (
    <div className={`grid  ${showFilter ? s.showFilter : 'grid-cols-1'}`}>
      {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
      <div className="position-relative">
        {!isLoaded && (
          <>
            {mobileScreen ? (
              <CollectionListLoading numOfItems={4} cols={2} />
            ) : (
              <CollectionListLoading
                numOfItems={showFilter ? 6 : 8}
                cols={showFilter ? 3 : 4}
              />
            )}
          </>
        )}

        {isLoaded && (
          <div className={cs(s.collectionList, `row animate-grid`)}>
            {listData?.map(item => (
              <CollectionItem
                className={'col-wide-2_5 col-xl-3 col-lg-4 col-6'}
                key={`collection-item-${item.tokenID}`}
                data={item}
              />
            ))}
          </div>
        )}
        {listData?.length === 0 && (
          <Empty projectInfo={projectInfo} className={s.list_empty} />
        )}
      </div>
    </div>
  );
};

export default CollectionList;
