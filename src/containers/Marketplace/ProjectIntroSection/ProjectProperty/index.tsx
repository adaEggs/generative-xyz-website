import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import Text from '@components/Text';
import Heading from '@components/Heading';
import { formatBTCPrice } from '@utils/format';
import { useContext } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';

export const ProjectProperty = (): JSX.Element => {
  const { project, isRoyalty } = useContext(ProjectLayoutContext);
  return (
    <div className={s.stats}>
      <div className={s.stats_item}>
        <Text size="12" fontWeight="medium">
          Items
        </Text>
        <Heading as="h6" fontWeight="medium">
          {project?.maxSupply}
        </Heading>
      </div>
      {!!project?.btcFloorPrice && (
        <div className={s.stats_item}>
          <Text size="12" fontWeight="medium">
            Floor Price
          </Text>
          <Heading as="h6" fontWeight="medium">
            {formatBTCPrice(project?.btcFloorPrice)}
          </Heading>
        </div>
      )}
      {isRoyalty && (
        <div className={s.stats_item}>
          <Text size="12" fontWeight="medium">
            royalty
          </Text>
          <Heading as="h6" fontWeight="medium">
            {(project?.royalty || 0) / 100}%
          </Heading>
        </div>
      )}
    </div>
  );
};
