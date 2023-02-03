import Button from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { useRouter } from 'next/router';
import React from 'react';
import { Stack } from 'react-bootstrap';
import Select from 'react-select';
import s from './styles.module.scss';

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'closed',
    label: 'Closed',
  },
];

const ProposalList: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const user = useAppSelector(getUserSelector);
  // const [sort, setSort] = useState('all');

  const handleNavigateToCreatePage = (): void => {
    // TODO Check wallet GEN token balance
    router.push(`${ROUTE_PATH.DAO}/create`);
  };

  return (
    <div className={s.proposalList}>
      <div className="container">
        <div className={s.header}>
          <div className={s.leftContent}>
            <Heading as="h2" fontWeight="medium">
              DAO
            </Heading>
            <Text>[description]</Text>
          </div>
          <div className={s.rightContent}>
            <Button onClick={handleNavigateToCreatePage} disabled={!user}>
              Submit proposal
            </Button>
            <Text>Connect wallet to make a proposal.</Text>
          </div>
        </div>
        <Stack direction="horizontal" className="justify-between">
          <Heading as="h4" fontWeight="semibold">
            Proposals
          </Heading>
          <div className={s.dropDownWrapper}>
            <Select
              isSearchable={false}
              isClearable={false}
              defaultValue={SORT_OPTIONS[0]}
              options={SORT_OPTIONS}
              className={s.selectInput}
              classNamePrefix="select"
              // onChange={(op: SingleValue<SelectOption>) => {
              //   // if (op) setSort(op.value);
              // }}
            />
          </div>
        </Stack>
        <div className={`${s.proposalList_container}`}>
          {/* <Card status="active" />
          <Card />
          <Card /> */}
        </div>
      </div>
    </div>
  );
};

export default ProposalList;
