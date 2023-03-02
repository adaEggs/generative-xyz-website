import ButtonIcon from '@components/ButtonIcon';
import Dropdown from '@components/Dropdown';
import Heading from '@components/Heading';
import Text from '@components/Text';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { TraitStats } from '@interfaces/project';
import { useContext, useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { v4 } from 'uuid';
import styles from './styles.module.scss';

type Props = {
  attributes?: TraitStats[];
};

const FilterOptions = ({ attributes }: Props) => {
  const {
    // filterBuyNow,
    // setFilterBuyNow,
    filterTraits,
    setFilterTraits,
    query,
    setQuery,
    setPage,
    showFilter,
    setShowFilter,
    // filterPrice,
    // setFilterPrice,
  } = useContext(GenerativeProjectDetailContext);

  const [sortedAttributes, setSortedAttributes] = useState<TraitStats[] | null>(
    null
  );

  const initialAttributesMap = () => {
    const attrMap = new Map();

    attributes?.forEach(attr => {
      filterTraits.split(',').forEach(trait => {
        if (trait.split(':')[0] === attr.traitName) {
          attrMap.set(attr.traitName, trait.split(':')[1]);
        }
      });
    });
    setQuery(attrMap);
  };

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

    setPage(1);
  };

  const handleResetAllFilter = () => {
    setFilterTraits('');
    initialAttributesMap();
  };

  // const handleMinPriceChange = (value: string) => {
  //   if (value) {
  //     setFilterPrice({
  //       ...filterPrice,
  //       from_price: `${Web3.utils.toWei(value, 'ether') || ''}`,
  //     });
  //   } else {
  //     setFilterPrice({
  //       ...filterPrice,
  //       from_price: '',
  //     });
  //   }
  // };
  // const handleMaxPriceChange = (value: string) => {
  //   if (value) {
  //     setFilterPrice({
  //       ...filterPrice,
  //       to_price: `${Web3.utils.toWei(value, 'ether')}`,
  //     });
  //   } else {
  //     setFilterPrice({
  //       ...filterPrice,
  //       to_price: '',
  //     });
  //   }
  // };

  useEffect(() => {
    if (attributes) {
      initialAttributesMap();
      const _attirbutes = [...attributes];
      setSortedAttributes(
        _attirbutes.sort((a, b) => a.traitName.localeCompare(b.traitName))
      );
    }
  }, [attributes, filterTraits]);

  return (
    <div className={styles.filter_wrapper}>
      <Heading fontWeight="semibold" className={styles.filter_title}>
        Filter
      </Heading>
      {/* DO NOT REMOVE CODE BELOW */}
      {/* <div className={styles.filter_buy}>
        <Text size="18" fontWeight="medium">
          Buy now
        </Text>
        <ToogleSwitch onChange={() => setFilterBuyNow(!filterBuyNow)} />
      </div>
      <div className="divider"></div>
      <div className={styles.filter_price}>
        <Text size="18" fontWeight="medium">
          Price range
        </Text>
        <div className={styles.filter_price_input}>
          <input
            placeholder="Min"
            type="number"
            step="any"
            onChange={debounce(e => {
              handleMinPriceChange(e.target.value);
            }, 1000)}
          ></input>
          <div>-</div>
          <input
            min={
              Number(Web3.utils.fromWei(filterPrice?.from_price, 'ether')) || 0
            }
            placeholder="Max"
            type="number"
            step="any"
            onChange={debounce(e => {
              handleMaxPriceChange(e.target.value);
            }, 1000)}
          ></input>
          <Text>ETH</Text>
        </div>
      </div> */}
      {sortedAttributes && sortedAttributes?.length > 0 && (
        <>
          <div className="divider"></div>
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
              {sortedAttributes?.length > 0 &&
                sortedAttributes.map(attr => {
                  const _traitStats = [...attr.traitValuesStat];

                  const options: Array<{ value: string; label: string }> =
                    _traitStats
                      .sort((a, b) => a.rarity - b.rarity)
                      .map(item => {
                        return {
                          value: item.value,
                          label: item.value,
                          // (
                          //   <Stack
                          //     direction="horizontal"
                          //     className="justify-between"
                          //   >
                          //     <Text size="14" fontWeight="medium">
                          //       {item.value}
                          //     </Text>
                          //     <Text
                          //       size="12"
                          //       fontWeight="medium"
                          //       color="black-40"
                          //     >
                          //       {item.rarity}%
                          //     </Text>
                          //   </Stack>
                          // ),
                        };
                      });

                  const defaultValue = options.filter(
                    option => option.value === query?.get(attr.traitName)
                  );

                  return (
                    <Dropdown
                      values={defaultValue}
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
