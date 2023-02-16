import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
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
  const { showFilter } = useContext(GenerativeProjectDetailContext);

  return (
    <div
      className={`${s.listToken} grid  ${
        showFilter ? s.showFilter : 'grid-cols-1'
      }`}
    >
      {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
      <div className="position-relative">
        {!isLoaded && (
          <>
            <CollectionListLoading numOfItems={12} showFilter={showFilter} />
          </>
        )}

        {isLoaded && (
          <div className={cs(s.collectionList, `row animate-grid`)}>
            {listData?.map(item => (
              <CollectionItem
                className={`${
                  showFilter
                    ? 'col-wide-3 col-xl-4 col-12'
                    : 'col-wide-2_5 col-xl-3 col-lg-4 col-12'
                } `}
                key={`collection-item-${item.tokenID}`}
                data={item}
              />
            ))}
          </div>
        )}
        {isLoaded && listData && listData?.length === 0 && (
          <Empty projectInfo={projectInfo} className={s.list_empty} />
        )}
      </div>
    </div>
  );
};

export default CollectionList;
