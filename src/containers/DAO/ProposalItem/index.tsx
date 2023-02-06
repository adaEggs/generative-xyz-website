import Text from '@components/Text';
import { Proposal } from '@interfaces/dao';
import s from './styles.module.scss';

type TProposalItem = {
  data: Proposal;
};

const ProposalItem = ({ data }: TProposalItem) => {
  return (
    <div className={s.wrapper}>
      <Text size="18" className="line-clamp-3">
        {data?.description}
      </Text>
    </div>
  );
};

export default ProposalItem;
