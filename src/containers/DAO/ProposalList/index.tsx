import Button from '@components/ButtonIcon';
import Card from '@components/Card';
import Heading from '@components/Heading';
import Link from '@components/Link';
import NotFound from '@components/NotFound';
import Text from '@components/Text';
import { NETWORK_CHAIN_ID } from '@constants/config';
import { GEN_TOKEN_ADDRESS } from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { ProposalState } from '@enums/dao';
import { ErrorMessage } from '@enums/error-message';
import { LogLevel } from '@enums/log-level';
import useContractOperation from '@hooks/useContractOperation';
import useOnClickOutside from '@hooks/useOnClickOutSide';
import { Proposal } from '@interfaces/dao';
import { SelectOption } from '@interfaces/select-input';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import GetTokenBalanceOperation from '@services/contract-operations/erc20/get-token-balance';
import DelegateGENTokenOperation from '@services/contract-operations/gen-token/delegate-token';
import { getProposalList } from '@services/dao';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Select, { SingleValue } from 'react-select';
import useAsyncEffect from 'use-async-effect';
import ProposalItem from '../ProposalItem';
import DelegateVoteModal from './DelegateVoteModal';
import s from './styles.module.scss';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filterState, setFilterState] = useState<string[]>();
  const [proposalList, setProposalList] = useState<Proposal[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isProccessing, setIsProccessing] = useState(false);
  const [genBalance, setGenBalance] = useState(0);
  const [showDelegateVoteModal, setShowDelegateVoteModal] = useState(false);
  const [showDelegateOptions, setShowDelegateOptions] = useState(false);

  const { call: getTokenBalance } = useContractOperation(
    GetTokenBalanceOperation,
    false
  );

  const { call: delegateGENToken } = useContractOperation(
    DelegateGENTokenOperation,
    true
  );

  const handleNavigateToCreatePage = (): void => {
    if (genBalance > 0) {
      router.push(`${ROUTE_PATH.DAO}/create`);
    } else {
      toast.error('Not enough GEN to submit proposal.');
    }
  };

  const handleShowDelegateOptions = (): void => {
    setShowDelegateOptions(!showDelegateOptions);
  };

  const handleDelegateGENToken = async (): Promise<void> => {
    if (isProccessing) return;
    if (user) {
      setIsProccessing(true);
      const tx = await delegateGENToken({
        chainID: NETWORK_CHAIN_ID,
        delegateeAddress: user?.walletAddress,
      });
      if (tx) {
        toast.success('Delegated successfully.');
      } else {
        toast.error(ErrorMessage.DEFAULT);
      }
      setIsProccessing(false);
    } else {
      toast.error('Login');
    }
  };

  const handleShowDelegateModal = (): void => {
    if (isProccessing) return;

    setShowDelegateVoteModal(true);
    setShowDelegateOptions(false);
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

  useOnClickOutside(dropdownRef, () => setShowDelegateOptions(false));

  return (
    <>
      <DelegateVoteModal
        isShow={showDelegateVoteModal}
        onHideModal={() => setShowDelegateVoteModal(false)}
      />
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

                <div ref={dropdownRef} className="position-relative">
                  <Button
                    variants="outline"
                    disabled={!user}
                    onClick={handleShowDelegateOptions}
                  >
                    Delegate vote
                  </Button>
                  {showDelegateOptions && (
                    <ul className={`${s.delegate_dropdown} `}>
                      <li
                        className="dropdown-item"
                        onClick={handleDelegateGENToken}
                      >
                        Delegate to myself
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={handleShowDelegateModal}
                      >
                        Delegate to address
                      </li>
                    </ul>
                  )}
                </div>
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
                {[...Array(6)].map((_, index) => (
                  <Card isLoading key={`proposal-skeleton-${index}`} />
                ))}
              </>
            )}
            {!isLoading &&
              proposalList &&
              proposalList?.length > 0 &&
              proposalList.map((item, index) => (
                <Link
                  href={`${ROUTE_PATH.DAO}/${item.proposalID}`}
                  className="no-underline"
                  key={`proposal-item-${index}`}
                >
                  <Card heading={item?.title} status={item?.state}>
                    <ProposalItem data={item} />
                  </Card>
                </Link>
              ))}

            {!proposalList ||
              (proposalList?.length === 0 && (
                <NotFound infoText={'No Proposal found'} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalList;
