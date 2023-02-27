import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import cs from 'classnames';
import React, { useContext } from 'react';
import s from './styles.module.scss';

// const SORT_OPTIONS: Array<{ value: string; label: string }> = [
//   {
//     value: 'newest',
//     label: 'Recently Listed',
//   },
//   {
//     value: 'minted-newest',
//     label: 'Date minted: Newest',
//   },
//   {
//     value: 'token-price-desc',
//     label: 'Price: High to Low',
//   },
//   {
//     value: 'token-price-asc',
//     label: 'Price: Low to High',
//   },
// ];

interface IProps {
  // keyword: string;
  // sort: string;
  // onKeyWordChange: (k: string) => void;
  // onSortChange: (v: string) => void;
  // placeholderSearch?: string;
  className?: string;
}

const TokenTopFilter: React.FC<IProps> = ({
  // keyword,
  // sort,
  // onKeyWordChange,
  // onSortChange,
  // placeholderSearch,
  className,
}: IProps): React.ReactElement => {
  // const selectedOption = useMemo(() => {
  //   return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  // }, [sort]);

  const { showFilter, setShowFilter } = useContext(
    GenerativeProjectDetailContext
  );

  return (
    <div className={cs(s.tokenTopFilter, className)}>
      <div className={cs(s.filterWrapper)}>
        <ButtonIcon
          variants={showFilter ? 'primary' : 'outline'}
          startIcon={
            showFilter ? (
              <SvgInset size={16} svgUrl={`${CDN_URL}/icons/ic-close.svg`} />
            ) : (
              <SvgInset size={16} svgUrl={`${CDN_URL}/icons/ic-filter.svg`} />
            )
          }
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </ButtonIcon>
      </div>
      {/* DO NOT REMOVE CODE BELOW */}
      {/* <div className={s.inputWrapper}>
        <div className={s.inputPrefixWrapper}>
          <Image
            src={`${CDN_URL}/icons/ic-search-14x14.svg`}
            width={20}
            height={20}
            alt="ic-triangle-exclamation"
          />
        </div>
        <input
          defaultValue={keyword}
          onChange={debounce(e => {
            onKeyWordChange(e.target.value);
          }, 500)}
          className={s.input}
          placeholder={placeholderSearch}
          type="text"
        />
      </div>
      <div className={s.dropDownWrapper}>
        <Select
          isSearchable={false}
          isClearable={false}
          defaultValue={selectedOption}
          options={SORT_OPTIONS}
          className={'select-input'}
          classNamePrefix="select"
          onChange={(op: SingleValue<SelectOption>) => {
            if (op) onSortChange(op.value);
          }}
        />
      </div> */}
    </div>
  );
};

export default TokenTopFilter;
