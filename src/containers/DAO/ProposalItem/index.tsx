import Text from '@components/Text';
import { Proposal } from '@interfaces/dao';
import s from './styles.module.scss';
import VoteProgress from '@components/VoteProgress';
import cs from 'classnames';
import { ProposalState } from '@enums/dao';

type TProposalItem = {
  data: Proposal;
};

const ProposalItem = ({ data }: TProposalItem) => {
  return (
    <div className={s.wrapper}>
      <Text size="18" className={cs(s.desc, 'line-clamp-3')}>
        {data?.description}
      </Text>
      {data.state !== ProposalState.Pending && (
        <VoteProgress stats={data.vote} />
      )}
    </div>
  );
};

export default ProposalItem;
