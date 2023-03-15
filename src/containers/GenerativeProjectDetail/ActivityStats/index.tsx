import Text from '@components/Text';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { SelectOption } from '@interfaces/select-input';
import { useContext, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import s from './ActivityStats.module.scss';
import CollectionActivityTable from './Table';

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: '0,1,2,3',
    label: 'All',
  },
  {
    value: '3',
    label: 'Sales',
  },
  {
    value: '1',
    label: 'Listing',
  },
];

const ActivityStats = () => {
  const { setFilterActivities } = useContext(GenerativeProjectDetailContext);

  const [sort, setSort] = useState<string | null>('');

  const selectedOption = useMemo(() => {
    return SORT_OPTIONS.find(op => sort === op.value) ?? SORT_OPTIONS[0];
  }, [sort]);

  return (
    <div className={s.wrapper}>
      <div className="d-flex align-items-center justify-between">
        <Text size="18" fontWeight="medium">
          Activity
        </Text>
        <div className={s.dropDownWrapper}>
          <Select
            isSearchable={false}
            isClearable={false}
            defaultValue={selectedOption}
            options={SORT_OPTIONS}
            className={s.selectInput}
            classNamePrefix="select"
            onChange={(op: SingleValue<SelectOption>) => {
              if (op) {
                setFilterActivities(op.value);
                // setPageNum(0);
                setSort(op.value);
                // setProjects(undefined);
              }
            }}
          />
        </div>
      </div>
      <CollectionActivityTable />
    </div>
  );
};

export default ActivityStats;
