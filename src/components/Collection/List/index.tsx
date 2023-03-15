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
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { v4 } from 'uuid';
import Text from '@components/Text';
import useWindowSize from '@hooks/useWindowSize';
import ActivityStats from '@containers/GenerativeProjectDetail/ActivityStats';

const CollectionList = ({
  listData,
  projectInfo,
  isLoaded = true,
  layout = 'mint',
}: {
  listData?: Token[] | null;
  projectInfo?: Project | null;
  isLoaded?: boolean;
  layout?: 'mint' | 'shop';
}) => {
  const {
    showFilter,
    filterTraits,
    setFilterTraits,
    collectionActivities,
    isLimitMinted,
  } = useContext(GenerativeProjectDetailContext);

  const { mobileScreen } = useWindowSize();

  const hasTraitAtrribute = useMemo(
    () => projectInfo?.traitStat && projectInfo?.traitStat?.length > 0,
    [projectInfo?.traitStat]
  );
  // const hasTraitAtrribute = true;

  const handleRemoveFilter = (trait: string) => {
    const newFilterTraits = filterTraits
      .split(',')
      .filter(item => item !== trait)
      .join(',');
    setFilterTraits(newFilterTraits);
  };

  const layoutCols = layout === 'mint' ? 'col-xl-4' : 'col-xl-4 ';

  return (
    <div
      className={`${s.listToken} row ${
        layout === 'mint' && !mobileScreen ? s.showFilter : 'grid-cols-1'
      }`}
    >
      {collectionActivities && isLimitMinted && (
        <div className="col-3">
          {layout === 'mint' && !mobileScreen && (
            <FilterOptions attributes={projectInfo?.traitStat} />
          )}
        </div>
      )}
      <div
        className={`${
          collectionActivities && isLimitMinted && 'col-12 col-md-5'
        }`}
      >
        {filterTraits && filterTraits.length > 0 && (
          <div className={s.filterList}>
            {filterTraits.split(',').map(trait => (
              <div
                key={`trait-${v4()}`}
                className={cs(s.filterItem, 'd-flex align-items-center')}
              >
                <Text>{`${trait.split(':')[0]}: ${trait.split(':')[1]}`}</Text>
                <SvgInset
                  size={8}
                  svgUrl={`${CDN_URL}/icons/ic-close.svg`}
                  className={cs(s.removeIcon, 'cursor-pointer')}
                  onClick={() => {
                    handleRemoveFilter(trait);
                  }}
                />
              </div>
            ))}
            <ButtonIcon onClick={() => setFilterTraits('')}>
              Clear all
            </ButtonIcon>
          </div>
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
                    showFilter ? 'col-wide-3 col-xl-4 col-12' : layoutCols
                  } `}
                  key={`collection-item-${item.tokenID}`}
                  data={item}
                  total={projectInfo?.maxSupply}
                />
              ))}
            </div>
          )}
          {isLoaded && listData && listData?.length === 0 && (
            <Empty
              projectInfo={projectInfo}
              className={s.list_empty}
              content={
                <>
                  <p>No available results for selected filters.</p>
                  <p>Please try again.</p>
                </>
              }
            />
          )}
        </div>
      </div>
      {collectionActivities &&
        isLimitMinted &&
        collectionActivities.result.length > 0 && (
          <div className="col-12 col-md-3">
            <ActivityStats />
          </div>
        )}
    </div>
  );
};

export default CollectionList;
