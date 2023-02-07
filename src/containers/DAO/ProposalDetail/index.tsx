import Skeleton from '@components/Skeleton';
import React, { useEffect, useState } from 'react';
import s from './styles.module.scss';
import MarkdownPreview from '@components/MarkdownPreview';
import { Proposal } from '@interfaces/dao';
import { useRouter } from 'next/router';
import { getProposalByOnChainID } from '@services/dao';
import { ROUTE_PATH } from '@constants/route-path';
import CurrentResultSkeleton from './CurrentResultSkeleton';
import CurrentResult from './CurrentResult';
import dayjs from 'dayjs';
import { formatLongAddress } from '@utils/format';
import DiscordShare from '@components/DiscordShare';
import LinkShare from '@components/LinkShare';
import TwitterShare from '@components/TwitterShare';

const ProposalDetail: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);

  const fetchProposal = async () => {
    try {
      const { proposalID } = router.query;
      const res = await getProposalByOnChainID(proposalID as string);
      setProposal(res);
    } catch (err: unknown) {
      router.push(ROUTE_PATH.DAO);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchProposal();
    const intervalID = setInterval(fetchProposal, 60000);

    return () => {
      clearInterval(intervalID);
    };
  }, [router]);

  return (
    <div className={s.proposalPreview}>
      <div className="container">
        <div className="row">
          <div className="col-xl-8">
            <div className={s.proposalInfoWrapper}>
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
              <div className={s.proposerInfoWrapper}>
                {proposal?.proposer ? (
                  <p
                    className={s.proposerInfo}
                  >{`Proposer : ${formatLongAddress(proposal.proposer)}`}</p>
                ) : (
                  <div className={s.proposerInfoSkeleton}>
                    <Skeleton fill />
                  </div>
                )}
                {proposal?.proposer ? (
                  <p className={s.proposerInfo}>{`Proposed on: ${dayjs(
                    proposal.proposer
                  ).format('MMM dd YYYY')}`}</p>
                ) : (
                  <div className={s.proposerInfoSkeleton}>
                    <Skeleton fill />
                  </div>
                )}
              </div>
              {proposal ? (
                <div className={s.socialWrapper}>
                  <LinkShare url={location.href} />
                  <DiscordShare />
                  <TwitterShare
                    url={location.href}
                    title={proposal.title}
                    hashtags={['generative.xyz', 'DAO']}
                  />
                </div>
              ) : (
                <div className={s.socialSkeleton}>
                  <Skeleton fill />
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-3 offset-xl-1">
            {!proposal && <CurrentResultSkeleton />}
            {proposal && <CurrentResult proposal={proposal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
