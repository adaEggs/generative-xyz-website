import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import cs from 'classnames';
import { useContext, useMemo } from 'react';
import FilterOptions from '../FilterOptions';
import CollectionListLoading from '../Loading';
import s from './CollectionList.module.scss';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';

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

  const hasTraitAtrribute = useMemo(
    () => projectInfo?.traitStat && projectInfo?.traitStat?.length > 0,
    [projectInfo?.traitStat]
  );
  // const hasTraitAtrribute = true;

  return (
    <div
      className={`${s.listToken} grid  ${
        showFilter && hasTraitAtrribute ? s.showFilter : 'grid-cols-1'
      }`}
    >
      {showFilter && hasTraitAtrribute && (
        <FilterOptions attributes={projectInfo?.traitStat} />
      )}
      <div className="position-relative">
        {!isLoaded && (
          <>
            <CollectionListLoading
              numOfItems={12}
              showFilter={hasTraitAtrribute}
            />
          </>
        )}

        {isLoaded && (
          <div className={cs(s.collectionList, `row animate-grid`)}>
            {listData?.map(item => (
              <CollectionItem
                className={`${
                  hasTraitAtrribute
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
