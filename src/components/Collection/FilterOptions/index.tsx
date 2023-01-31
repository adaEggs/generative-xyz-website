import ButtonIcon from '@components/ButtonIcon';
import Dropdown from '@components/Dropdown';
import Heading from '@components/Heading';
import Text from '@components/Text';
import ToogleSwitch from '@components/Toggle';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { TraitStats } from '@interfaces/project';
import { useCallback, useContext, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { v4 } from 'uuid';
import styles from './styles.module.scss';

type Props = {
  attributes?: TraitStats[];
};

const FilterOptions = ({ attributes }: Props) => {
  const {
    filterBuyNow,
    setFilterBuyNow,
    filterTraits,
    setFilterTraits,
    query,
    setQuery,
    setPage,
    showFilter,
    setShowFilter,
  } = useContext(GenerativeProjectDetailContext);

  const initialAttributesMap = useCallback(() => {
    const attrMap = new Map();
    attributes?.forEach(attr => {
      attrMap.set(attr.traitName, '');
    });
    setQuery(attrMap);
  }, [attributes]);

  const handleSelectFilter = (
    values: { value: string; label: string }[],
    attr: TraitStats
  ) => {
    const newQuery = query?.set(attr.traitName, values[0].label);
    let str = '';
    newQuery?.forEach((value: string, key: string) => {
      if (value) {
        str += `,${key}:${value}`;
      }
    });
    setFilterTraits(str.substring(1));
    setQuery(newQuery || null);
    setPage(1);
  };

  const handleResetAllFilter = () => {
    setFilterTraits('');
    initialAttributesMap();
  };

  useEffect(() => {
    initialAttributesMap();
  }, [attributes]);

  return (
    <div className={styles.filter_wrapper}>
      <Heading fontWeight="semibold" className={styles.filter_title}>
        Filter
      </Heading>
      {/* )} */}
      <div className={styles.filter_buy}>
        <Text size="18" fontWeight="medium">
          Buy now
        </Text>
        <ToogleSwitch onChange={() => setFilterBuyNow(!filterBuyNow)} />
      </div>
      <div className="divider"></div>
      {attributes && (
        <>
          <div className={styles.filter_traits}>
            <Stack direction="horizontal" className="justify-between">
              <Text size="18" fontWeight="medium">
                Attributes
              </Text>
              <ButtonIcon
                sizes="small"
                variants="ghost"
                onClick={handleResetAllFilter}
              >
                <Text size="14" fontWeight="medium">
                  Reset all
                </Text>
              </ButtonIcon>
            </Stack>
            <div className={styles.filter_traits_dropdown}>
              {attributes?.length > 0 &&
                attributes.map(attr => {
                  const options: Array<{ value: string; label: string }> =
                    attr.traitValuesStat.map(item => {
                      return {
                        value: item.value,
                        label: `${item.value}`,
                      };
                    });

                  const defaultValue = options.filter(
                    option => option.value === query?.get(attr.traitName)
                  );

                  return (
                    <Dropdown
                      values={filterTraits ? defaultValue : []}
                      options={options}
                      multi={false}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(values: any) =>
                        handleSelectFilter(values, attr)
                      }
                      placeholder={attr.traitName}
                      className={styles.filter_dropdown}
                      key={`trait-${v4()}`}
                      addPlaceholder={`${attr.traitName}: `}
                    />
                  );
                })}
            </div>
          </div>
        </>
      )}
      <div className={styles.filter_CTA}>
        <ButtonIcon>
          <Text fontWeight="medium" onClick={() => setShowFilter(!showFilter)}>
            Apply
          </Text>
        </ButtonIcon>
        <ButtonIcon variants="ghost" onClick={() => setShowFilter(!showFilter)}>
          <Text fontWeight="medium">Cancel</Text>
        </ButtonIcon>
      </div>
    </div>
  );
};

export default FilterOptions;
