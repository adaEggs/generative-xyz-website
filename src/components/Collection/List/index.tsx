import ButtonIcon from '@components/ButtonIcon';
import { Empty } from '@components/Collection/Empty';
import CollectionItem from '@components/Collection/Item';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { Project } from '@interfaces/project';
import { Token } from '@interfaces/token';
import cs from 'classnames';
import { useContext, useEffect, useMemo } from 'react';
import FilterOptions from '../FilterOptions';
import CollectionListLoading from '../Loading';
import s from './CollectionList.module.scss';

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
  const { showFilter, filterTraits, setFilterTraits, setIsLayoutShop } =
    useContext(GenerativeProjectDetailContext);

  const hasTraitAtrribute = useMemo(
    () => projectInfo?.traitStat && projectInfo?.traitStat?.length > 0,
    [projectInfo?.traitStat]
  );

  const handleRemoveFilter = (trait: string) => {
    const newFilterTraits = filterTraits
      .split(',')
      .filter(item => item !== trait)
      .join(',');
    setFilterTraits(newFilterTraits);
  };

  const layoutCols =
    layout === 'mint'
      ? 'col-wide-2_5 col-xl-4 col-12'
      : 'col-xxxl-3 col-xl-4 col-md-6 col-12 ';

  const renderLeftSide = () => {
    if (layout === 'shop') {
      return null;
    } else {
      return (
        <>
          {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
        </>
      );
    }
  };

  useEffect(() => {
    setIsLayoutShop(layout && layout === 'shop');
    // return () => {
    //   setIsLayoutShop(false);
    // };
  }, []);

  return (
    <div
      className={`${s.listToken} grid row ${
        showFilter ? s.showFilter : 'grid-cols-1'
      }`}
    >
      {renderLeftSide()}
      <div className={``}>
        {filterTraits && filterTraits.length > 0 && (
          <div className={s.filterList}>
            {filterTraits.split(',').map((trait, index) => (
              <div
                key={`trait-${projectInfo?.tokenID}-${index}`}
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
            <div className={s.loading}>
              <CollectionListLoading
                numOfItems={12}
                showFilter={hasTraitAtrribute}
              />
            </div>
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
                  layout={layout}
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
    </div>
  );
};

export default CollectionList;
