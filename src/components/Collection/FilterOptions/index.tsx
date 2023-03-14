import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Text from '@components/Text';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { TraitStats } from '@interfaces/project';
import { useContext, useEffect, useRef, useState } from 'react';
import { Stack } from 'react-bootstrap';
import Select, { components } from 'react-select';
import { v4 } from 'uuid';
import styles from './styles.module.scss';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import RadioGroups from '@components/Input/Radio';

type Props = {
  attributes?: TraitStats[];
};

const FilterOptions = ({ attributes }: Props) => {
  const {
    filterTraits,
    setFilterTraits,
    setPage,
    showFilter,
    setShowFilter,
    // filterPrice,
    // setFilterPrice,
  } = useContext(GenerativeProjectDetailContext);

  const filterdropdownRef = useRef<HTMLDivElement>(null);

  const [sortedAttributes, setSortedAttributes] = useState<TraitStats[] | null>(
    null
  );
  const [currentTraitOpen, setCurrentTraitOpen] = useState('');

  const buyNowOptions = [
    { key: 'buy-now', value: 'Only buy now' },
    { key: 'All', value: 'Show all' },
  ];

  const handleResetAllFilter = () => {
    setFilterTraits('');
    setCurrentTraitOpen('');
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Option = (props: any) => {
    const attrName = props.label.split(':')[0];
    const rarity = props.label.split(':')[1];

    const { value, selectProps } = props;

    const handleSelectOption = () => {
      setCurrentTraitOpen(selectProps.placeholder);

      const str = `${selectProps.placeholder}:${value}`;
      setFilterTraits(prev => {
        if (!prev) {
          return str;
        }
        if (prev.includes(str)) {
          const list = prev.split(',');
          const newList = list.filter(item => item !== str);

          return newList.length > 1 ? newList.join(',') : newList[0];
        } else {
          return `${prev},${str}`;
        }
      });
      setPage(1);
    };

    const defaultChecked = filterTraits
      ?.split(',')
      ?.includes(`${selectProps.placeholder}:${value}`);

    return (
      <div>
        <components.Option {...props}>
          <Stack
            direction="horizontal"
            className="justify-between cursor-pointer"
            onClick={handleSelectOption}
          >
            <label htmlFor={`trait-${attrName}`}>{attrName}</label>
            <Stack direction="horizontal" gap={3} className={styles.checkbox}>
              <Text as="span" color="black-40">
                {rarity}
              </Text>
              <input
                type="checkbox"
                id={`trait-${attrName}`}
                checked={defaultChecked}
              />
            </Stack>
          </Stack>
        </components.Option>
      </div>
    );
  };

  useEffect(() => {
    if (attributes) {
      const _attirbutes = [...attributes];
      setSortedAttributes(
        _attirbutes.sort((a, b) => a.traitName.localeCompare(b.traitName))
      );
    }
  }, [attributes]);

  useOnClickOutside(filterdropdownRef, () => setCurrentTraitOpen(''));

  return (
    <div className={styles.filter_wrapper}>
      <Heading fontWeight="semibold" className={styles.filter_title}>
        Filter
      </Heading>
      {/* DO NOT REMOVE CODE BELOW */}
      <div className={styles.filter_buy}>
        <Text size="18" fontWeight="medium">
          Status
        </Text>
        <RadioGroups
          options={buyNowOptions}
          name="buyNow"
          defaultValue={buyNowOptions[1].key}
        />
      </div>
      <div className={styles.rarity}>
        <Select
          id={`rarity`}
          key={`rarity`}
          isMulti
          name={`rarity`}
          // options={options}
          className={styles.selectInput}
          // components={{
          //   Option,
          // }}
          // onFocus={() => setCurrentTraitOpen(attr.traitName)}
          // onInputChange={() => setCurrentTraitOpen('')}
          classNamePrefix="select"
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          controlShouldRenderValue={false}
          isClearable={false}
          isSearchable={false}
          placeholder={'Rarity'}
        />
      </div>
      <div className="price">
        <Select
          id={`price`}
          key={`price`}
          isMulti
          name={`price`}
          // options={options}
          className={styles.selectInput}
          // components={{
          //   Option,
          // }}
          // onFocus={() => setCurrentTraitOpen(attr.traitName)}
          // onInputChange={() => setCurrentTraitOpen('')}
          classNamePrefix="select"
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          controlShouldRenderValue={false}
          isClearable={false}
          isSearchable={false}
          placeholder={'Price'}
        />
      </div>
      {/* <div className="divider"></div> */}
      {/* <div className={styles.filter_price}>
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
          {/* <div className="divider"></div> */}
          <div className={styles.filter_traits}>
            <Stack direction="horizontal" className="justify-between">
              <Text size="18" fontWeight="medium">
                Attributes
              </Text>
              <ButtonIcon
                sizes="small"
                variants="ghost"
                onClick={handleResetAllFilter}
                className={styles.reset_all}
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
                          label: `${item.value}:${item.rarity}%`,
                        };
                      });

                  return (
                    <Select
                      defaultMenuIsOpen={currentTraitOpen === attr.traitName}
                      id={`attributes-${v4()}`}
                      key={`attributes-${v4()}`}
                      isMulti
                      name={`attributes-${v4()}`}
                      options={options}
                      className={styles.selectInput}
                      components={{
                        Option,
                      }}
                      // onFocus={() => setCurrentTraitOpen(attr.traitName)}
                      // onInputChange={() => setCurrentTraitOpen('')}
                      onMenuOpen={() => setCurrentTraitOpen(attr.traitName)}
                      onBlur={() => setCurrentTraitOpen('')}
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      controlShouldRenderValue={false}
                      isClearable={false}
                      placeholder={attr.traitName}
                      autoFocus={currentTraitOpen === attr.traitName}
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
