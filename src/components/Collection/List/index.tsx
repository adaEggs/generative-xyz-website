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

const CollectionList = ({
  listData,
  projectInfo,
  isLoaded = true,
}: {
  listData?: Token[] | null;
  projectInfo?: Project | null;
  isLoaded?: boolean;
}) => {
  const { showFilter, filterTraits, setFilterTraits } = useContext(
    GenerativeProjectDetailContext
  );

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

  return (
    <div
      className={`${s.listToken} grid  ${
        showFilter ? s.showFilter : 'grid-cols-1'
      }`}
    >
      {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
      <div>
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
                    showFilter
                      ? 'col-wide-3 col-xl-4 col-12'
                      : 'col-wide-2_5 col-xl-3 col-lg-4 col-sm-6 col-12'
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
                !!filterTraits && (
                  <>
                    <p>No available results for selected filters.</p>
                    <p>Please try again.</p>
                  </>
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
