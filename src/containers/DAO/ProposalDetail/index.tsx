import Skeleton from '@components/Skeleton';
import React, { useState } from 'react';
import s from './styles.module.scss';
import MarkdownPreview from '@components/MarkdownPreview';
import { Proposal } from '@interfaces/dao';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { getProposalByOnChainID } from '@services/dao';
import { ROUTE_PATH } from '@constants/route-path';
import CurrentResultSkeleton from './CurrentResultSkeleton';
import CurrentResult from './CurrentResult';

const ProposalDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  useAsyncEffect(async () => {
    if (!router.isReady) return;
    try {
      const { proposalID } = router.query;
      const res = await getProposalByOnChainID(proposalID as string);
      setProposal(res);
    } catch (err: unknown) {
      router.push(ROUTE_PATH.DAO);
    }
  }, [router]);

  // const fundingAmount = useMemo((): string => {
  //   const currency =
  //     proposal?.tokenType === TokenType.ERC20 ? APP_TOKEN_SYMBOL : getChainCurrency();
  //   return `${formatCurrency(
  //     parseFloat(proposal?.amount ?? '0')
  //   )} ${currency}`;
  // }, [proposal?.amount, proposal?.tokenType]);

  return (
    <div className={s.proposalPreview}>
      <div className="container">
        <div className="row">
          <div className="col-xl-8">
            {proposal?.title ? (
              <h1 className={s.title}>{proposal?.title}</h1>
            ) : (
              <div className={s.titleSkeleton}>
                <Skeleton fill />
              </div>
            )}
            {proposal?.description ? (
              <div className={s.description}>
                <p className={s.descriptionLabel}>Description</p>
                <MarkdownPreview source={proposal?.description} />
              </div>
            ) : (
              <>
                <div className={s.descriptionLabelSkeleton}>
                  <Skeleton fill />
                </div>
                <div className={s.descriptionSkeleton}>
                  <Skeleton fill />
                </div>
              </>
            )}
          </div>
          <div className="col-xl-3 offset-xl-1">
            {!proposal && <CurrentResultSkeleton></CurrentResultSkeleton>}
            {proposal && <CurrentResult proposal={proposal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
