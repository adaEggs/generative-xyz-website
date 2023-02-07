import MarkdownPreview from '@components/MarkdownPreview';
import VoteProgress from '@components/VoteProgress';
import { ProposalState } from '@enums/dao';
import { Proposal } from '@interfaces/dao';
import cs from 'classnames';
import s from './styles.module.scss';

type TProposalItem = {
  data: Proposal;
};

const ProposalItem = ({ data }: TProposalItem) => {
  return (
    <div className={s.wrapper}>
      <div className={cs(s.desc, 'line-clamp-3')}>
        <MarkdownPreview source={data?.description} />
      </div>
      {data.state !== ProposalState.Pending && (
        <VoteProgress stats={data.vote} />
      )}
    </div>
  );
};

export default ProposalItem;
