import Button from '@components/ButtonIcon';
import Card from '@components/Card';
import Heading from '@components/Heading';
import NotFound from '@components/NotFound';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { ProposalState } from '@enums/dao';
import { LogLevel } from '@enums/log-level';
import { Proposal } from '@interfaces/dao';
import { SelectOption } from '@interfaces/select-input';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { getProposalList } from '@services/dao';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import useAsyncEffect from 'use-async-effect';
import { v4 } from 'uuid';
import ProposalItem from '../ProposalItem';
import s from './styles.module.scss';
import useContractOperation from '@hooks/useContractOperation';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import { NETWORK_CHAIN_ID } from '@constants/config';
import { GEN_TOKEN_ADDRESS } from '@constants/contract-address';
import { toast } from 'react-hot-toast';
import Link from '@components/Link';

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: '',
    label: 'All',
  },
  {
    value: `${ProposalState.Active}`,
    label: 'Active',
  },
  {
    value: `${ProposalState.Pending}`,
    label: 'Pending',
  },
  {
    value: `${ProposalState.Canceled}`,
    label: 'Canceled',
  },
  {
    value: `${ProposalState.Defeated}`,
    label: 'Defeated',
  },
  {
    value: `${ProposalState.Succeeded}`,
    label: 'Succeeded',
  },
  {
    value: `${ProposalState.Queued}`,
    label: 'Queued',
  },
  {
    value: `${ProposalState.Expired}`,
    label: 'Expired',
  },
  {
    value: `${ProposalState.Executed}`,
    label: 'Executed',
  },
];

const LOG_PREFIX = 'ProposalList';

const ProposalList: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const user = useAppSelector(getUserSelector);
  const [filterState, setFilterState] = useState<string[]>();
  const [proposalList, setProposalList] = useState<Proposal[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [genBalance, setGenBalance] = useState(0);

  const { call: getTokenBalance } = useContractOperation(
    GetTokenBalanceOperation,
    false
  );

  const handleNavigateToCreatePage = (): void => {
    // TODO Check wallet GEN token balance
    if (genBalance > 0) {
      router.push(`${ROUTE_PATH.DAO}/create`);
    } else {
      toast.error('Not enough GEN to submit proposal.');
    }
  };

  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      const { result } = await getProposalList({
        // proposer: ,
        page: 1,
        limit: 100,
        state: filterState,
      });
      setProposalList(result);
    } catch (err: unknown) {
      log('failed to get products', LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsLoading(false);
    }
  }, [filterState]);

  useAsyncEffect(async () => {
    const balance = await getTokenBalance({
      chainID: NETWORK_CHAIN_ID,
      erc20TokenAddress: GEN_TOKEN_ADDRESS,
    });
    if (balance !== null) {
      setGenBalance(balance);
    }
  }, [user]);

  return (
    <div className={s.proposalList}>
      <div className="container">
        <div className={s.header}>
          <div className={s.leftContent}>
            <Heading as="h2" fontWeight="medium">
              Generative DAO
            </Heading>
            <div className={s.DAO_description}>
              <Text>
                At Generative, our goal is to create a generative art
                infrastructure that artists and collectors can rely on —
                forever.
              </Text>
              <Text>
                The GEN token enables shared community ownership and active
                stewardship of the Generative protocol. GEN holders govern the
                protocol through an on-chain governance process.
              </Text>
              <Text>
                Artists and collectors are no longer just users. They become
                co-owners and co-operators. They help to build and shape the
                Generative protocol.
              </Text>
            </div>
          </div>
          <div className={s.rightContent}>
            <div className={s.CTA_btns}>
              <Button onClick={handleNavigateToCreatePage} disabled={!user}>
                Submit proposal
              </Button>
              <Button variants="secondary" disabled={!user}>
                Delegate vote
              </Button>
            </div>
            {!user && <Text>Connect wallet to make a proposal.</Text>}
          </div>
        </div>
        <div className={s.proposalList_title}>
          <Heading as="h4" fontWeight="semibold">
            Proposals
          </Heading>
          <div className={s.dropDownWrapper}>
            <Select
              isSearchable={false}
              isClearable={false}
              defaultValue={FILTER_OPTIONS[0]}
              options={FILTER_OPTIONS}
              className={s.selectInput}
              classNamePrefix="select"
              onChange={(op: SingleValue<SelectOption>) => {
                if (op) setFilterState([op.value]);
              }}
            />
          </div>
        </div>

        <div className={`${s.proposalList_container}`}>
          {isLoading && (
            <>
              {[...Array(6)].map(() => (
                <Card isLoading key={`proposal-skeleton-${v4()}`} />
              ))}
            </>
          )}
          {!isLoading &&
            proposalList &&
            proposalList?.length > 0 &&
            proposalList.map(item => (
              <Link
                href={`${ROUTE_PATH.DAO}/${item.proposalID}`}
                className="no-underline"
                key={`proposal-item-${v4()}`}
              >
                <Card
                  heading={item?.title || 'Title Here'}
                  body={<ProposalItem data={item} />}
                  status={item?.state}
                />
              </Link>
            ))}

          {!proposalList ||
            (proposalList?.length === 0 && (
              <NotFound infoText={'No Proposal found'} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalList;
