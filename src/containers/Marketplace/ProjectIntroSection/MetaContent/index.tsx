import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import Text from '@components/Text';
import { useContext } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { SocialAndReport } from '@containers/Marketplace/ProjectIntroSection/SocailAndReport';

export const RenderMetaContent = (): JSX.Element => {
  const { mintedDate, isFullonChain } = useContext(ProjectLayoutContext);
  return (
    <>
      <div className={s.project_info}>
        <Text size="14" color="black-40">
          Created date: {mintedDate}
        </Text>
        <Text size="14" color="black-40">
          Fully on-chain: {isFullonChain ? 'Yes' : 'No'}
        </Text>
      </div>
      <SocialAndReport />
    </>
  );
};
